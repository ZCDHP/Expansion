import { ConstructorMap } from "../infrastructure/utils";
import * as Union from "../infrastructure/union";

import { Message as LoginMessage } from "./client.login";
import { Message as MatchFindingMessage } from "./client.matchFinding";

export namespace Message {
    export const Tags = {
        Login: "Login",
        MatchFinding: "MatchFinding",
    } as const;
    export type Tags = typeof Tags;

    export type Login = Union.Case<Tags["Login"], LoginMessage>;
    export const Login = Union.Case(Tags.Login)<LoginMessage>();

    export type MatchFinding = Union.Case<Tags["MatchFinding"], MatchFindingMessage>;
    export const MatchFinding = Union.Case(Tags.MatchFinding)<MatchFindingMessage>();

    export const Constructor = {
        Login: ConstructorMap<LoginMessage, typeof LoginMessage.Constructor, Login>(LoginMessage.Constructor, Login),
        MatchFinding: ConstructorMap<MatchFindingMessage, typeof MatchFindingMessage.Constructor, MatchFinding>(MatchFindingMessage.Constructor, MatchFinding),
    }
}

export type Message =
    | Message.Login
    | Message.MatchFinding
