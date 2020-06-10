import * as Union from "../infrastructure/union";

export namespace Operation {
    export const Tags = {
        Disconnect: "Disconnect",
    } as const;
    export type Tags = typeof Tags;

    export type Disconnect = Union.Case<Tags["Disconnect"], { connectionId: number, reason: string }>;
    export const Disconnect = Union.Case(Tags.Disconnect)<{ connectionId: number, reason: string }>();
}

export type Operation =
    | Operation.Disconnect
