import * as Union from "../infrastructure/union";

export namespace Message {
    export const Tags = {
        Reject: "Reject",
    } as const;
    export type Tags = typeof Tags;


    export type Reject = Union.Case<Tags["Reject"], { reason: string }>;
    export const Reject = Union.Case(Tags.Reject)<{ reason: string }>();

    export const Constructor = {
        Reject,
    }
}

export type Message =
    | Message.Reject