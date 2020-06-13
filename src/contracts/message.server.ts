import * as Union from "../infrastructure/union";

export namespace Message {
    export const Tags = {
        ConnectionRejected: "ConnectionRejected",
        ApproveLogin: "ApproveLogin",
    } as const;
    export type Tags = typeof Tags;


    export type ConnectionRejected = Union.Case<Tags["ConnectionRejected"], { reason: string }>;
    export const ConnectionRejected = Union.Case(Tags.ConnectionRejected)<{ reason: string }>();

    export type ApproveLogin = Union.Case<Tags["ApproveLogin"], void>;
    export const ApproveLogin = Union.Case(Tags.ApproveLogin)<void>();
}

export type Message =
    | Message.ConnectionRejected
    | Message.ApproveLogin
