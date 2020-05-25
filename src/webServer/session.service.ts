require('source-map-support').install();

import Redis from 'ioredis';

import { WebConfig } from '../config/webServer';

import * as Event from '../infrastructure/event';
import { Locker as InMemoryLocker } from '../infrastructure/locker.inMemory';

import * as ConnectionState from "./projection.connection";
import * as SessionState from './session/projection';
import { CommandHandler } from './session/commandHandler';
import { Command, Tags as CommandTags } from './session/commands';


export const SessionService = (webConfig: WebConfig) => {
    let connections: { [sessionId: number]: ConnectionState.State } = {};

    const redisConnection = new Redis(webConfig.redis.port, webConfig.redis.host);
    const locker = InMemoryLocker();

    return (sessionId: number, command: Command) => {
        const redisKey = webConfig.RedisKeyForSession(sessionId);
        return locker(sessionId)(async () => {
            const cached = await redisConnection.get(redisKey);
            const sessionState = cached ?
                JSON.parse(cached) as SessionState.State :
                SessionState.Projection.initialState;

            const events = CommandHandler(sessionState)(command);
            const newSessionState = Event.Reduce(SessionState.Reducer)(sessionState)(events);

            if (newSessionState.type == SessionState.Projection.initialState.type)
                await redisConnection.del(redisKey);
            else
                await redisConnection.set(redisKey, JSON.stringify(newSessionState));

            const connectionState = command.type == CommandTags.Connect ?
                ConnectionState.Projection(command.data.connection).initialState :
                connections[sessionId];

            const newConnectionState = Event.Reduce(ConnectionState.Reduce)(connectionState)(events);

            if (newConnectionState.close)
                delete connections[sessionId];
            else
                connections[sessionId] = newConnectionState

            return events;
        });
    }
}
