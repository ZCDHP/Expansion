import * as Union from "../infrastructure/union";


import { Event as ConnectionEvents } from "./connection/events";
//import { Event as GConnectionEvents } from "../gConnection.domain/events";
import { Message } from "../client/message.client";

export const Tags = {
    ConnectionEvent: "ConnectionEvent",
    //GConnectionEvent: "GConnectionEvent",
    ClientMessage: "ClientMessage",
} as const;
export type Tags = typeof Tags;


export type ConnectionEvent = Union.Case<Tags["ConnectionEvent"], { sessionId: number, event: ConnectionEvents }>;
export type ClientMessage = Union.Case<Tags["ClientMessage"], { sessionId: number, message: Message }>;
//export type GConnectionEvent = Union.Case<Tags["GConnectionEvent"], { sessionId: number, event: GConnectionEvents }>;

export type Input =
    | ConnectionEvent
    | ClientMessage
//| GConnectionEvent
//| NewConnection

export const Input = {
    ConnectionEvent: Union.Case(Tags.ConnectionEvent)<{ sessionId: number, event: ConnectionEvents }>(),
    ClientMessage: Union.Case(Tags.ClientMessage)<{ sessionId: number, message: Message }>(),
    //GConnectionEvent: Union.Case(Tags.GConnectionEvent)<{ sessionId: number, event: GConnectionEvents }>(),
};
