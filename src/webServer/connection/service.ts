import ws from 'ws';

import { Never } from '../../infrastructure/utils';
import * as NumberSequence from '../../infrastructure/numberSequence';

import { Message as ServerMessage } from '../../contracts/serverMessage';


import { Event } from "../../contracts/connection.events";
import { State } from "./eventSource";
import { Operation } from "./operations";


type EventHandler = (e: Event) => void;

export type Service = {
    AddConnection: (connection: ws) => void,
    Apply: (connectionId: number, operation: Operation) => void,
};

export const Service: (eventHandler: EventHandler) => Service = eventHandler => {
    let state = State.Empty();
    let connectionIdStream = NumberSequence.Init();

    return {
        AddConnection: connection => {
            const connectionId = connectionIdStream;
            connectionIdStream = NumberSequence.Next(connectionIdStream);
            state = State.AddConnection(eventHandler)(connectionId)(connection)(state);
        },

        Apply: (connectionId, operation) => {
            switch (operation.type) {
                case Operation.Tags.Reject:
                    state = State.Send(connectionId)(ServerMessage.Constructor.Connection.Reject({ reason: operation.data.reason }))(state);
                    state = State.Close(eventHandler)(connectionId)(state);
                    return;
                case Operation.Tags.Send:
                    state = State.Send(connectionId)(operation.data)(state);
                    return;
                default: Never(operation);
            }
        }
    };
}
