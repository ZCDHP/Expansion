require('source-map-support').install();

import path from 'path';
import koa from 'koa';
import koa_static from 'koa-static';
import koa_ws from 'koa-websocket';
import ws from 'ws';

import { WebConfig } from '../config/webServer';

import * as NumberSequence from '../infrastructure/numberSequence';

import { Serve as ServePages } from "./servePages";
import { SessionService } from "./session.service"
import { Command } from './session/commands';


async function main() {
    let sessionIdStream = NumberSequence.Init();

    const config = WebConfig;
    console.log(JSON.stringify(config));

    const app = koa_ws(new koa());
    const www = path.join(__dirname, "../www");
    app.use(koa_static(www));

    app.use(ServePages);

    const sessionService = SessionService(config);

    app.ws.use(context => {
        const connection = (<any>context).websocket as ws;
        const sessionId = sessionIdStream;
        sessionIdStream = NumberSequence.Next(sessionIdStream);

        sessionService(sessionId, Command.Connect({ connection }));
    })

    app.listen(config.server.port);
}

main();
