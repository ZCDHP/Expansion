require('source-map-support').install();

import path from 'path';
import koa from 'koa';
import koa_static from 'koa-static';
import koa_ws from 'koa-websocket';

import { WebConfig } from '../config/webServer';

import { MessageBroker } from "../infrastructure/messageBroker";

import { Serve as ServePages } from "./servePages";

import { Event as ConnectionEvent } from "../contracts/connection.events";
import { Service as ConnectionService } from "./connection/service";
import { Operation as ConnectionOperation } from "./connection/operations";

import { Service as LoginService } from "./login.temp/service";

import { Service as MatchFindingService } from "../matchFinding/service";
import * as MatchFinding from "../matchFinding/domain";

import { Message as ServerMessage } from '../contracts/serverMessage';



async function main() {
    const config = WebConfig;
    console.log(JSON.stringify(config));

    const connectionEventBroker = MessageBroker<ConnectionEvent>();
    const matchFindingEventBroker = MessageBroker<MatchFinding.Event>();

    const connectionService = ConnectionService(connectionEventBroker.publish);
    const matchFindingService = MatchFindingService(matchFindingEventBroker.publish);


    connectionEventBroker.subscribe(LoginService((id, _event) => connectionService.Apply(id, ConnectionOperation.Send(ServerMessage.Constructor.Login.Approve()))));

    connectionEventBroker.subscribe(e => {
        if (e.type != "MessageReceived")
            return;

        const { connectionId, message } = e.data;
        switch (message.type) {
            case "MatchFinding": return matchFindingService(MatchFinding.Command.QueuePlayer({ playerId: connectionId }));
            default: return;
        }
    });

    const app = koa_ws(new koa());
    const www = path.join(__dirname, "../www");
    app.use(koa_static(www));

    app.use(ServePages);

    app.ws.use(context => connectionService.AddConnection(context.websocket));

    app.listen(config.server.port);
}

main();
