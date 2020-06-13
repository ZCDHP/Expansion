import * as Union from "../infrastructure/union";

export namespace Message {
    export const Tags = {
        Login: "Login",
        Anything: "Anything",
    } as const;
    export type Tags = typeof Tags;

    export type Login = Union.Case<Tags["Login"], void>;
    export const Login = Union.Case(Tags.Login)<void>();

    export type Anything = Union.Case<Tags["Anything"], any>;
    export const Anything = Union.Case(Tags.Anything)<any>();
}

export type Message =
    | Message.Login
    | Message.Anything
