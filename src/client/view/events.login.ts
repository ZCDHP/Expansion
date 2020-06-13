import * as Union from "../../infrastructure/union";


export namespace Event {
    export const Tags = {
        Connecting: "Connecting",
        LoggingIn: "LoggingIn",
        LoggedIn: "LoggedIn",
    } as const;
    export type Tags = typeof Tags;

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type LoggingIn = Union.Case<Tags["LoggingIn"], void>;
    export const LoggingIn = Union.Case(Tags.LoggingIn)<void>();

    export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<void>();

    export const Constructor = {
        Connecting,
        LoggingIn,
        LoggedIn,
    }
}

export type Event =
    | Event.Connecting
    | Event.LoggingIn
    | Event.LoggedIn

