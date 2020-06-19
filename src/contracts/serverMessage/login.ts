import * as Union from "../../infrastructure/union";

export namespace Message {
    export const Tags = {
        Approve: "Approve",
    } as const;
    export type Tags = typeof Tags;

    export type Approve = Union.Case<Tags["Approve"], void>;
    export const Approve = Union.Case(Tags.Approve)<void>();

    export const Constructor = {
        Approve,
    }
}

export type Message =
    | Message.Approve
