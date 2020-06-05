import koa_ws from 'koa-websocket';
import ws from 'ws';

import { Never } from '../infrastructure/utils';

import { WebConfig } from '../config/webServer';

import * as NumberSequence from '../infrastructure/numberSequence';

import { Command as ConnectionCommand } from './connection/commands';
import * as InMemoryConnection from './connection/inMemory';
import { Service as ConnectionService } from './connection/service';

import { Serve as ServeConnectionEvents } from "./server.serveConnectionEvents";
import * as ServeConnectionEventInput from "./inputs";
import * as ServeConnectionEventOutput from "./results";


export const HandleConnection: (config: WebConfig) => koa_ws.Middleware<any, {}> = config => {
    let sessionIdStream = NumberSequence.Init();
    let inMemoryConnectionState = InMemoryConnection.InitialState;

    const connectionService = ConnectionService(config);

    const completeEvent: (events: ServeConnectionEventInput.Input[]) => void = events => {
        if (events.length == 0)
            return;

        const event = events[0];
        const outputs = ServeConnectionEvents(event);

        for (const output of outputs) {
            switch (output.type) {
                case ServeConnectionEventOutput.Tags.ConnectionCommand:
                    connectionService(output.data.sessionId)(output.data.command)
                        .then(events => completeEvent(events.map(e => ServeConnectionEventInput.Input.ConnectionEvent({ sessionId: output.data.sessionId, event: e }))));
                    continue;
                case ServeConnectionEventOutput.Tags.ConnectionOperation:
                    inMemoryConnectionState = output.data(inMemoryConnectionState);
                    continue;
                default: return Never(output);
            }
        }

        return completeEvent(events.slice(1));
    }

    return (context: koa_ws.MiddlewareContext<any>) => {
        const connection = (<any>context).websocket as ws;
        const sessionId = sessionIdStream;
        sessionIdStream = NumberSequence.Next(sessionIdStream);

        inMemoryConnectionState = InMemoryConnection.Operations.Add(sessionId)(connection)(inMemoryConnectionState)

        connection.onmessage = e => completeEvent([ServeConnectionEventInput.Input.ClientMessage({ sessionId, message: JSON.parse(e.data as string) })]);

        connectionService(sessionId)(ConnectionCommand.Connect())
            .then(events => completeEvent(events.map(e => ServeConnectionEventInput.Input.ConnectionEvent({ sessionId: sessionId, event: e }))));
    }
}
