import { Never } from "../infrastructure/utils";
import * as Union from "../infrastructure/union";

import { State } from "./appState";
import { Operation as AllOperations } from "./operations";
import * as View from "./viewState.connection";
import { Message, Tags as MessageTags } from "./message.server";

export const Tags = {
    Connect: "Connect",
    Connected: "Connected",
    Disconnect: "Disconnect",
    Failed: "Failed",
} as const;
export type Tags = typeof Tags;

export type Connect = Union.Case<Tags["Connect"], void>;
export type Connected = Union.Case<Tags["Connected"], void>;
export type Disconnect = Union.Case<Tags["Disconnect"], void>;
export type Failed = Union.Case<Tags["Failed"], { reason: string }>;

export type Operation =
    | Connect
    | Connected
    | Disconnect
    | Failed

export const Operation = {
    Connect: Union.Case(Tags.Connect)<void>(),
    Connected: Union.Case(Tags.Connected)<void>(),
    Disconnect: Union.Case(Tags.Disconnect)<void>(),
    Failed: Union.Case(Tags.Failed)<{ reason: string }>(),
}

export const Apply: (operation: Operation) => (onOperation: (operation: AllOperations) => void) => (stats: State) => State = operation => {
    switch (operation.type) {
        case Tags.Connect: return Connect(operation);
        case Tags.Connected: return Connected(operation);
        case Tags.Disconnect: throw new Error("No Implementation");
        case Tags.Failed: return Failed(operation);
        default: Never(operation);
    }
};

const Connect: (operation: Connect) => (onOperation: (operation: AllOperations) => void) => (stats: State) => State = _operation => onOperation => state => {
    if (state.viewState.Connection.type != View.Tags.None)
        return state;

    const protocol = location.protocol === 'https:' ? "wss" : "ws";
    const url = `${protocol}://${location.host}/`;
    const connection = new WebSocket(url);

    connection.onopen = _ => onOperation(AllOperations.Connection.Connected());

    connection.onmessage = e => {
        const message = JSON.parse(e.data as string) as Message;
        switch (message.type) {
            case MessageTags.ConnectionRejected: return onOperation(AllOperations.Connection.Failed(message.data));
            default: return;
        }
    };

    return {
        ...state,
        contextualState: {
            ...state.contextualState,
            connection,
        },
        viewState: {
            ...state.viewState,
            Connection: View.State.Connecting()
        },
    };
}

const Connected: (operation: Connected) => (onOperation: (operation: AllOperations) => void) => (stats: State) => State = _operation => _onOperation => state => {
    if (state.viewState.Connection.type != View.Tags.Connecting)
        return state;

    return {
        ...state,
        viewState: {
            ...state.viewState,
            Connection: View.State.Connected(),
        }
    };
}

const Failed: (operation: Failed) => (onOperation: (operation: AllOperations) => void) => (stats: State) => State = operation => _onOperation => state => {
    if (state.contextualState.Connection.connection)
        state.contextualState.Connection.connection.close();

    return {
        ...state,
        contextualState: {
            ...state.contextualState,
            connection: null,
        },
        viewState: {
            ...state.viewState,
            Connection: View.State.Failed(operation.data),
        },
    }
}
