import * as Union from "../infrastructure/union";

export const Tags = {
    LoginAttempted: "LoginAttempted",
    LoggedIn: "LoggedIn",
} as const;
export type Tags = typeof Tags;


export type LoginAttempted = Union.Case<Tags["LoginAttempted"], { id: number }>;
export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;

export type Event =
    | LoginAttempted
    | LoggedIn

export const Event = {
    LoginAttempted: Union.Case(Tags.LoginAttempted)<{ id: number }>(),
    LoggedIn: Union.Case(Tags.LoggedIn)<void>(),
};
