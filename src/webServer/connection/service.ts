import Redis from 'ioredis';

import { WebConfig } from '../../config/webServer';

import * as EventDef from '../../infrastructure/event';
import { Locker as InMemoryLocker } from '../../infrastructure/locker.inMemory';
import { MessageBus as MB } from "../../infrastructure/messageBus.inMemory";

import * as ConnectionState from './projection';
import { CommandHandler } from './commandHandler';
import { Command } from './commands';


export const Service = (webConfig: WebConfig) => {
    const redisConnection = new Redis(webConfig.redis.port, webConfig.redis.host);
    const locker = InMemoryLocker();

    const issueCommand = (sessionId: number) => (command: Command) => {
        const redisKey = webConfig.RedisKeyForSession(sessionId);
        return locker(sessionId)(async () => {
            const cached = await redisConnection.get(redisKey);
            const sessionState = cached ?
                JSON.parse(cached) as ConnectionState.State :
                ConnectionState.Projection.initialState;

            const events = CommandHandler(sessionState)(command);
            const newSessionState = EventDef.Reduce(ConnectionState.Reducer)(sessionState)(events);

            if (newSessionState.type == ConnectionState.Projection.initialState.type)
                await redisConnection.del(redisKey);
            else
                await redisConnection.set(redisKey, JSON.stringify(newSessionState));

            return events;
        });
    }

    return issueCommand;
}


export const MessageBus = (webConfig: WebConfig) => MB(Service(webConfig));
