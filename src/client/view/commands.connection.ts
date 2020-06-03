import * as Union from "../../infrastructure/union";

export const Tags = {
    Connecting: "Connecting",
    Connected: "Connected",
    Rejected: "Rejected",
} as const;
export type Tags = typeof Tags;

export type Connecting = Union.Case<Tags["Connecting"], void>;
export type Connected = Union.Case<Tags["Connected"], void>;
export type Rejected = Union.Case<Tags["Rejected"], { reason: string }>;

export type Command =
    | Connecting
    | Connected
    | Rejected

export const Command = {
    Connecting: Union.Case(Tags.Connecting)<void>(),
    Connected: Union.Case(Tags.Connected)<void>(),
    Rejected: Union.Case(Tags.Rejected)<{ reason: string }>(),
}
