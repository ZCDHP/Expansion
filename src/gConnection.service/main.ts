require('source-map-support').install();

import Redis from 'ioredis';
import { connect as NatsConnect } from "ts-nats";

import { Config as CommonConfig } from '../config/common';
import { Config as Config } from '../config/gConnection';

import * as Event from '../infrastructure/event';
import { Locker as InMemoryLocker } from '../infrastructure/locker.inMemory';

import * as PlayerState from '../gConnection.domain/projection.player';
import { CommandHandler } from '../gConnection.domain/commandHandler';
import { MessageBus } from './messageBus';
import { Never } from '../infrastructure/utils';

async function main() {
    console.log(JSON.stringify(CommonConfig));
    console.log(JSON.stringify(Config));
    const natsClient = await NatsConnect(CommonConfig.eventBusNatsUrl);
    const messageBus = MessageBus(natsClient, Config);
    const redisConnection = new Redis(Config.redis.port, Config.redis.host);

    const locker = InMemoryLocker();

    messageBus.subscribeCommand((playerId, command) => {
        console.log(`Player[${playerId}], Command: ${JSON.stringify(command)}`);
        const redisKey = Config.RedisKeyForPlayer(playerId);

        locker(playerId)(async () => {
            const cached = await redisConnection.get(redisKey);
            console.log(`Player[${playerId}], State: ${cached}`);
            const state = cached ?
                JSON.parse(cached) as PlayerState.State :
                PlayerState.State.NotConnected();

            const events = CommandHandler(state)(command);
            const newState = Event.Reduce(PlayerState.Reducer)(state)(events);

            events.forEach(messageBus.publishEvent(playerId));
            events.forEach(e => console.log(`Player[${playerId}], Event: ${JSON.stringify(e)}`));

            switch (newState.type) {
                case PlayerState.Tags.Connected: return await redisConnection.set(redisKey, JSON.stringify(newState));
                case PlayerState.Tags.NotConnected: return await redisConnection.del(redisKey);
                default: Never(newState);
            }
        });
    });
}
main();

