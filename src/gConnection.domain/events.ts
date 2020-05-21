import * as Union from "../infrastructure/union";
import { ConstructorMap } from "../infrastructure/utils";

export namespace RejectionReason {
    export const Tags = {
        Player_Already_Connected: "Player_Already_Connected",
        Other: "Other",
    } as const;
    export type Tags = typeof Tags;

    export type Player_Already_Connected = Union.Case<Tags["Player_Already_Connected"], void>;
    export type Other = Union.Case<Tags["Other"], string>;

    export type Value =
        | Player_Already_Connected
        | Other

    export const Value = {
        Player_Already_Connected: Union.Case(Tags.Player_Already_Connected)<void>(),
        Other: Union.Case(Tags.Other)<string>(),
    };
}

type Rejection = {
    reason: RejectionReason.Value,
}

export const Tags = {
    Connected: "Connected",
    Rejected: "Rejected",
    Disconnected: "Disconnected",
} as const;
export type Tags = typeof Tags;

export type Connected = Union.Case<Tags["Connected"], void>;
export type Rejected = Union.Case<Tags["Rejected"], Rejection>;
export type Disconnected = Union.Case<Tags["Disconnected"], void>;

export type Event =
    | Connected
    | Rejected
    | Disconnected

export const Event = {
    Connected: Union.Case(Tags.Connected)<void>(),
    Rejected: ConstructorMap<RejectionReason.Value, typeof RejectionReason.Value, Rejected>(
        RejectionReason.Value,
        reason => Union.Case(Tags.Rejected)<Rejection>()({ reason }),
    ),
    Disconnected: Union.Case(Tags.Disconnected)<void>(),
}
