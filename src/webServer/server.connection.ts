import koa_ws from 'koa-websocket';
import ws from 'ws';

import { Never } from '../infrastructure/utils';

import { WebConfig } from '../config/webServer';

import * as NumberSequence from '../infrastructure/numberSequence';

import { Command as ConnectionCommand } from './connection/commands';
import * as InMemoryConnection from './connection/inMemory';
import { MessageBus as ConnectionMessageBus } from './connection/service';

import { Serve as ServeConnectionEvents } from "./serveConnectionEvents";
import * as ServeConnectionEventInput from "./inputs";
import * as ServeConnectionEventOutput from "./results";


export const HandleConnection: (config: WebConfig) => koa_ws.Middleware<any, {}> = config => {
    let sessionIdStream = NumberSequence.Init();
    let inMemoryConnectionState = InMemoryConnection.InitialState;

    const connectionMessageBus = ConnectionMessageBus(config);
    connectionMessageBus.subscribeEvent((sessionId, event) => completeEvent(ServeConnectionEventInput.Input.ConnectionEvent({ sessionId, event })))

    const completeEvent: (event: ServeConnectionEventInput.Input) => void = event => {
        const outputs = ServeConnectionEvents(event);

        for (const output of outputs) {
            switch (output.type) {
                case ServeConnectionEventOutput.Tags.ConnectionCommand:
                    connectionMessageBus.publishCommand(output.data.sessionId, output.data.command);
                    continue;
                case ServeConnectionEventOutput.Tags.ConnectionOperation:
                    inMemoryConnectionState = output.data(inMemoryConnectionState);
                    continue;
                default: return Never(output);
            }
        }
        return;
    }


    return (context: koa_ws.MiddlewareContext<any>) => {
        const connection = (<any>context).websocket as ws;
        const sessionId = sessionIdStream;
        sessionIdStream = NumberSequence.Next(sessionIdStream);

        inMemoryConnectionState = InMemoryConnection.Operations.Add(sessionId)(connection)(inMemoryConnectionState)

        connection.onmessage = e => completeEvent(ServeConnectionEventInput.Input.ClientMessage({ sessionId, message: JSON.parse(e.data as string) }));

        connectionMessageBus.publishCommand(sessionId, ConnectionCommand.Connect());
    }
}
