import { ConstructorMap } from "../infrastructure/utils";
import * as Union from "../infrastructure/union";

import { Message as ConnectionMessage } from "./serverMessage/connection";
export { Message as ConnectionMessage } from "./serverMessage/connection";

import { Message as LoginMessage } from "./serverMessage/login";
export { Message as LoginMessage } from "./serverMessage/login";

import { Message as MatchFindingMessage } from "./serverMessage/matchFinding";
export { Message as MatchFindingMessage } from "./serverMessage/matchFinding";

export namespace Message {
    export const Tags = {
        Connection: "Connection",
        Login: "Login",
        MatchFinding: "MatchFinding",
    } as const;
    export type Tags = typeof Tags;

    export type Connection = Union.Case<Tags["Connection"], ConnectionMessage>;
    export const Connection = Union.Case(Tags.Connection)<ConnectionMessage>();

    export type Login = Union.Case<Tags["Login"], LoginMessage>;
    export const Login = Union.Case(Tags.Login)<LoginMessage>();

    export type MatchFinding = Union.Case<Tags["MatchFinding"], MatchFindingMessage>;
    export const MatchFinding = Union.Case(Tags.MatchFinding)<MatchFindingMessage>();

    export const Constructor = {
        Connection: ConstructorMap<ConnectionMessage, typeof ConnectionMessage.Constructor, Connection>(ConnectionMessage.Constructor, Connection),
        Login: ConstructorMap<LoginMessage, typeof LoginMessage.Constructor, Login>(LoginMessage.Constructor, Login),
        MatchFinding: ConstructorMap<MatchFindingMessage, typeof MatchFindingMessage.Constructor, MatchFinding>(MatchFindingMessage.Constructor, MatchFinding),
    }
}

export type Message =
    | Message.Connection
    | Message.Login
    | Message.MatchFinding
