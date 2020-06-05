import * as Union from "../../infrastructure/union";

export const Tags = {
    Start: "Start",
    Connected: "Connected",
    Login: "Login",
    LoginApproved: "LoginApproved",
} as const;
export type Tags = typeof Tags;

export type Start = Union.Case<Tags["Start"], void>;
export type Connected = Union.Case<Tags["Connected"], void>;
export type Login = Union.Case<Tags["Login"], void>;
export type LoginApproved = Union.Case<Tags["LoginApproved"], void>;

export type Command =
    | Start
    | Connected
    | Login
    | LoginApproved

export const Command = {
    Start: Union.Case(Tags.Start)<void>(),
    Connected: Union.Case(Tags.Connected)<void>(),
    Login: Union.Case(Tags.Login)<void>(),
    LoginApproved: Union.Case(Tags.LoginApproved)<void>(),
};
