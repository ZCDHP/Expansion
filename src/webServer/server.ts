require('source-map-support').install();

import path from 'path';
import koa from 'koa';
import koa_static from 'koa-static';
import koa_ws from 'koa-websocket';

import { WebConfig } from '../config/webServer';

import { MessageBroker } from "../infrastructure/messageBroker";

import { Serve as ServePages } from "./servePages";
import { Event as ConnectionEvent } from "../contracts/events.connection";
import { Service as ConnectionService } from "./connection/service";
import { Operation as ConnectionOperation } from "./connection/operations";
import { Service as LoginService } from "./login.temp/service";

import * as ServerMessage from '../contracts/message.server';



async function main() {
    const config = WebConfig;
    console.log(JSON.stringify(config));

    const connectionEventBroker = MessageBroker<ConnectionEvent>();

    const connectionService = ConnectionService(connectionEventBroker.publish);

    connectionEventBroker.subscribe(LoginService((id, _event) => connectionService.Apply(id, ConnectionOperation.Send(ServerMessage.Message.ApproveLogin()))));

    const app = koa_ws(new koa());
    const www = path.join(__dirname, "../www");
    app.use(koa_static(www));

    app.use(ServePages);

    app.ws.use(context => connectionService.AddConnection(context.websocket));

    app.listen(config.server.port);
}

main();
