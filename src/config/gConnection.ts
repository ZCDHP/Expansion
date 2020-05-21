import { Service } from "./utils";

type JSONConfig = {
    service: Service,
    redis: Service,
};

const JSONConfig = require("./gConnection.json") as JSONConfig;

const Prefix = "GConnection";

export const GConnectionConfig = {
    ...JSONConfig,
    SubjectForCommands: (playerId: number) => `${Prefix}.Command.${playerId}`,
    SubjectForAllCommands: `${Prefix}.Command.*`,
    SubjectForEvents: (playerId: number) => `${Prefix}.Event.${playerId}`,
    SubjectForAllEvents: `${Prefix}.Event.*`,
    Prefix,
    RedisKeyForPlayer: (playerId: number) => `Player.${playerId}`,
};

export type Config = typeof GConnectionConfig;
