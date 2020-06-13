import * as Union from "../../infrastructure/union";

import { Message as ServerMessage } from "../../contracts/serverMessage";

export namespace Operation {
    export const Tags = {
        Send: "Send",
        Reject: "Reject",
    } as const;
    export type Tags = typeof Tags;

    export type Send = Union.Case<Tags["Send"], ServerMessage>;
    export const Send = Union.Case(Tags.Send)<ServerMessage>();

    export type Reject = Union.Case<Tags["Reject"], { reason: string }>;
    export const Reject = Union.Case(Tags.Reject)<{ reason: string }>();
}

export type Operation =
    | Operation.Send
    | Operation.Reject
