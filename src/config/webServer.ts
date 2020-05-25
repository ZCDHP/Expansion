import { Service } from "./utils";

type Config = {
    server: Service,
    redis: Service,
};

export const JSONConfig = require("./webServer.json") as Config;

export const WebConfig = {
    ...JSONConfig,
    RedisKeyForSession: (sessionId: number) => `Session.${sessionId}`,
};

export type WebConfig = typeof WebConfig;