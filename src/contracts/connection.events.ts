import * as Union from "../infrastructure/union";

import { Message as ClientMessage } from './clientMessage';


export namespace Event {
    export const Tags = {
        Connected: "Connected",
        MessageReceived: "MessageReceived",
        Disconnected: "Disconnected",
    } as const;
    export type Tags = typeof Tags;

    type Identified<T> = { connectionId: number } & T;

    export type Connected = Union.Case<Tags["Connected"], Identified<{}>>;
    export const Connected = (connectionId: number) => Union.Case(Tags.Connected)<Identified<{}>>()({ connectionId });

    export type MessageReceived = Union.Case<Tags["MessageReceived"], Identified<{ message: ClientMessage }>>;
    export const MessageReceived = (connectionId: number, message: ClientMessage) => Union.Case(Tags.MessageReceived)<Identified<{ message: ClientMessage }>>()({ connectionId, message });

    export type Disconnected = Union.Case<Tags["Disconnected"], Identified<{}>>;
    export const Disconnected = (connectionId: number) => Union.Case(Tags.Disconnected)<Identified<{}>>()({ connectionId });
}

export type Event =
    | Event.Connected
    | Event.MessageReceived
    | Event.Disconnected
