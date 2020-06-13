import * as Union from "../infrastructure/union";

export namespace Message {
    export const Tags = {
        Login: "Login",
    } as const;
    export type Tags = typeof Tags;

    export type Login = Union.Case<Tags["Login"], void>;
    export const Login = Union.Case(Tags.Login)<void>();

    export const Constructor = {
        Login,
    }
}

export type Message =
    | Message.Login
