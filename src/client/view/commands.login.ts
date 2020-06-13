import * as Union from "../../infrastructure/union";


export namespace Command {
    export const Tags = {
        Start: "Start",
        Connected: "Connected",
        Login: "Login",
        LoginApproved: "LoginApproved",
    } as const;
    export type Tags = typeof Tags;

    export type Start = Union.Case<Tags["Start"], void>;
    export const Start = Union.Case(Tags.Start)<void>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type Login = Union.Case<Tags["Login"], void>;
    export const Login = Union.Case(Tags.Login)<void>();

    export type LoginApproved = Union.Case<Tags["LoginApproved"], void>;
    export const LoginApproved = Union.Case(Tags.LoginApproved)<void>();

    export const Constructor = {
        Start,
        Connected,
        Login,
        LoginApproved,
    }
}

export type Command =
    | Command.Start
    | Command.Connected
    | Command.Login
    | Command.LoginApproved
