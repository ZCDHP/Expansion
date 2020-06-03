import * as Union from "../../infrastructure/union";
import { ConstructorMap } from "../../infrastructure/utils";

import { Event as ConnectionEvent } from "./events.connection";
import { Event as LoginEvent } from "./events.login";


export const Tags = {
    Connection: "Connection",
    Login: "Login",
} as const;
export type Tags = typeof Tags;

export type Connection = Union.Case<Tags["Connection"], ConnectionEvent>;
export const Connection = Union.Case(Tags.Connection)<ConnectionEvent>();

export type Login = Union.Case<Tags["Login"], LoginEvent>;

export type Event =
    | Connection
    | Login

export const Event = {
    Connection: ConstructorMap<ConnectionEvent, typeof ConnectionEvent, Connection>(ConnectionEvent, Union.Case(Tags.Connection)()),
    //Connection: Union.Case(Tags.Connection)<ConnectionEvent>(),
    //Login: Union.Case(Tags.Login)<LoginEvent>(),
    Login: ConstructorMap<LoginEvent, typeof LoginEvent, Login>(LoginEvent, Union.Case(Tags.Login)()),
};
