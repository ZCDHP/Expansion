import * as Union from "../infrastructure/union";

export namespace Message {
    export const Tags = {
        FindMatch: "FindMatch",
    } as const;
    export type Tags = typeof Tags;

    export type FindMatch = Union.Case<Tags["FindMatch"], void>;
    export const FindMatch = Union.Case(Tags.FindMatch)<void>();

    export const Constructor = {
        FindMatch,
    }
}

export type Message =
    | Message.FindMatch
