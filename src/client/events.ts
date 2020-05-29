import * as Union from "../infrastructure/union";
import { Event as ConnectionEvent } from "./events.connection";

//import { ConstructorMap } from "../infrastructure/utils";


export const Tags = {
    Connection: "Connection",
    Login: "Login",
} as const;
export type Tags = typeof Tags;

export type Connection = Union.Case<Tags["Connection"], ConnectionEvent>;
export type Login = Union.Case<Tags["Login"], void>;

export type Event =
    | Connection
    | Login

export const Event = {
    //Connection: ConstructorMap<ConnectionEvent, typeof ConnectionEvent, Connection>(ConnectionEvent, Union.Case(Tags.Connection)()),
    Connection: Union.Case(Tags.Connection)<ConnectionEvent>(),
};
