import { Service } from "./utils";

type Config = {
    server: Service
};

export const Config = require("./webServer.json") as Config;
