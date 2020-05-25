import * as Union from "../../infrastructure/union";

export const Tags = {
    Connected: "Connected",
    LoginAttempted: "LoginAttempted",
    ConnectionRejected: "ConnectionRejected",
} as const;
export type Tags = typeof Tags;


export type Connected = Union.Case<Tags["Connected"], void>;
export type LoginAttempted = Union.Case<Tags["LoginAttempted"], { playerId: number }>;
export type ConnectionRejected = Union.Case<Tags["ConnectionRejected"], { reason: string }>;

export type Event =
    | Connected
    | LoginAttempted
    | ConnectionRejected

export const Event = {
    Connected: Union.Case(Tags.Connected)<void>(),
    LoginAttempted: Union.Case(Tags.LoginAttempted)<{ playerId: number }>(),
    ConnectionRejected: Union.Case(Tags.ConnectionRejected)<{ reason: string }>(),
};
