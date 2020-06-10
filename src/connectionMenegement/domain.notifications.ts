import * as Union from "../infrastructure/union";


export namespace ConnectionNotification {
    export const Tags = {
        Connected: "Connected",
        LoggedIn: "LoggedIn",
    } as const;
    export type Tags = typeof Tags;

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<void>();
}

export type ConnectionNotification =
    | ConnectionNotification.Connected
    | ConnectionNotification.LoggedIn


export namespace Notification {
    export const Tags = {
        Connection: "Connection",
        TimePassed: "TimePassed",
    } as const;
    export type Tags = typeof Tags;

    export type NotificationForConnection = {
        connectionId: number,
        data: ConnectionNotification,
    }
    export type Connection = Union.Case<Tags["Connection"], NotificationForConnection>;
    export const Connection = Union.Case(Tags.Connection)<NotificationForConnection>();

    export type TimePassed = Union.Case<Tags["TimePassed"], { ms: number }>;
    export const TimePassed = Union.Case(Tags.TimePassed)<{ ms: number }>();
}

export type Notification =
    | Notification.Connection
    | Notification.TimePassed
