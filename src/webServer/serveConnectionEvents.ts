import { Never } from "../infrastructure/utils";

import { Input, Tags as InputTags } from "./inputs";
import { Result } from "./results"

import * as ConnectionEvents from "./connection/events";

import { Message as ClientMessage, Tags as ClientMessageTags } from "../client/message.client";
import { Message as ServerMessage } from "../client/message.server";

import { Operations } from "./connection/inMemory";


export const Serve: (input: Input) => Result[] = input => {
    switch (input.type) {
        case InputTags.ConnectionEvent: return ServeConnectionEvent(input.data.sessionId, input.data.event);
        case InputTags.ClientMessage: return ServeClientMessage(input.data.sessionId, input.data.message);
        default: Never(input);
    }
}
const ServeConnectionEvent: (sessionId: number, event: ConnectionEvents.Event) => Result[] = (sessionId: number, event: ConnectionEvents.Event) => {
    switch (event.type) {
        case ConnectionEvents.Tags.Disconnected: return [
            Result.ConnectionOperation(Operations.Disconnect(sessionId)),
        ]
        default: return [];
    }
}

const ServeClientMessage: (sessionId: number, message: ClientMessage) => Result[] = (sessionId: number, message: ClientMessage) => {
    switch (message.type) {
        case ClientMessageTags.Login: return [
            Result.ConnectionOperation(Operations.Send(sessionId)(ServerMessage.ApproveLogin())),
        ];
        default: return [];
    }
}
