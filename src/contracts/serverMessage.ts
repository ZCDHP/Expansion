import { ConstructorMap } from "../infrastructure/utils";
import * as Union from "../infrastructure/union";

import { Message as LoginMessage } from "./server.login";
import { Message as ConnectionMessage } from "./server.connection";

export namespace Message {
    export const Tags = {
        Connection: "Connection",
        Login: "Login",
    } as const;
    export type Tags = typeof Tags;

    export type Connection = Union.Case<Tags["Connection"], ConnectionMessage>;
    export const Connection = Union.Case(Tags.Connection)<ConnectionMessage>();

    export type Login = Union.Case<Tags["Login"], LoginMessage>;
    export const Login = Union.Case(Tags.Login)<LoginMessage>();

    export const Constructor = {
        Connection: ConstructorMap<ConnectionMessage, typeof ConnectionMessage.Constructor, Connection>(ConnectionMessage.Constructor, Connection),
        Login: ConstructorMap<LoginMessage, typeof LoginMessage.Constructor, Login>(LoginMessage.Constructor, Login),
    }
}

export type Message =
    | Message.Connection
    | Message.Login
