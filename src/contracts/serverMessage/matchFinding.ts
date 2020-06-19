import * as Union from "../../infrastructure/union";

export namespace Message {
    export const Tags = {
        Queued: "Queued",
        MatchFound: "MatchFound",
    } as const;
    export type Tags = typeof Tags;

    export type Queued = Union.Case<Tags["Queued"], void>;
    export const Queued = Union.Case(Tags.Queued)<void>();

    type MatchFoundData = {
        matchId: number,
    }
    export type MatchFound = Union.Case<Tags["MatchFound"], MatchFoundData>;
    export const MatchFound = Union.Case(Tags.MatchFound)<MatchFoundData>();

    export const Constructor = {
        Queued,
        MatchFound,
    }
}

export type Message =
    | Message.Queued
    | Message.MatchFound
