import * as Union from "../../infrastructure/union";
import { ConstructorMap } from "../../infrastructure/utils";

import { Event as ConnectionEvent } from "./events.connection";
import { Event as LoginEvent } from "./events.login";

export namespace Event {
    export const Tags = {
        Connection: "Connection",
        Login: "Login",
    } as const;
    export type Tags = typeof Tags;

    export type Connection = Union.Case<Tags["Connection"], ConnectionEvent>;
    export const Connection = Union.Case(Tags.Connection)<ConnectionEvent>();

    export type Login = Union.Case<Tags["Login"], LoginEvent>;
    export const Login = Union.Case(Tags.Login)<LoginEvent>();

    export const Constructor = {
        Connection: ConstructorMap<ConnectionEvent, typeof ConnectionEvent.Constructor, Connection>(ConnectionEvent.Constructor, Union.Case(Tags.Connection)()),
        Login: ConstructorMap<LoginEvent, typeof LoginEvent.Constructor, Login>(LoginEvent.Constructor, Union.Case(Tags.Login)()),
    }
}

export type Event =
    | Event.Connection
    | Event.Login

