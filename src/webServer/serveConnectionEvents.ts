import { Never } from "../infrastructure/utils";

import { Input, Tags as InputTags } from "./inputs";
import { Result } from "./results"

import { Message as ClientMessage, Tags as ClientMessageTags } from "../client/message.client";
import { Message as ServerMessage } from "../client/message.server";

import { Operations } from "./connection/inMemory";


export const Serve: (input: Input) => Result[] = input => {
    switch (input.type) {
        case InputTags.ConnectionEvent: return [];
        case InputTags.ClientMessage: return ServeClientMessage(input.data.sessionId, input.data.message);
        default: Never(input);
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
