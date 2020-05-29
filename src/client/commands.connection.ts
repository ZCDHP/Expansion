import * as Union from "../infrastructure/union";

export const Tags = {
    Connect: "Connect",
    Connected: "Connected",
    Disconnect: "Disconnect",
    Rejected: "Rejected",
} as const;
export type Tags = typeof Tags;

export type Connect = Union.Case<Tags["Connect"], void>;
export type Connected = Union.Case<Tags["Connected"], void>;
export type Disconnect = Union.Case<Tags["Disconnect"], void>;
export type Rejected = Union.Case<Tags["Rejected"], { reason: string }>;

export type Command =
    | Connect
    | Connected
    | Disconnect
    | Rejected

export const Command = {
    Connect: Union.Case(Tags.Connect)<void>(),
    Connected: Union.Case(Tags.Connected)<void>(),
    Disconnect: Union.Case(Tags.Disconnect)<void>(),
    Rejected: Union.Case(Tags.Rejected)<{ reason: string }>(),
}
