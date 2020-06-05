import * as Union from "../../infrastructure/union";

export const Tags = {
    Connecting: "Connecting",
    LoggingIn: "LoggingIn",
    LoggedIn: "LoggedIn",
} as const;
export type Tags = typeof Tags;

export type Connecting = Union.Case<Tags["Connecting"], void>;
export type LoggingIn = Union.Case<Tags["LoggingIn"], void>;
export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;

export type Event =
    | Connecting
    | LoggingIn
    | LoggedIn

export const Event = {
    Connecting: Union.Case(Tags.Connecting)<void>(),
    LoggingIn: Union.Case(Tags.LoggingIn)<void>(),
    LoggedIn: Union.Case(Tags.LoggedIn)<void>(),
};
