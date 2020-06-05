import * as Union from "../infrastructure/union";

export const Tags = {
    ConnectionRejected: "ConnectionRejected",
    ApproveLogin: "ApproveLogin",
    Anything: "Anything",
} as const;
export type Tags = typeof Tags;


export type ConnectionRejected = Union.Case<Tags["ConnectionRejected"], { reason: string }>;
export type ApproveLogin = Union.Case<Tags["ApproveLogin"], void>;
export type Anything = Union.Case<Tags["Anything"], any>;

export type Message =
    | ConnectionRejected
    | ApproveLogin
    | Anything

export const Message = {
    ConnectionRejected: Union.Case(Tags.ConnectionRejected)<{ reason: string }>(),
    ApproveLogin: Union.Case(Tags.ApproveLogin)<void>(),
    Anything: Union.Case(Tags.Anything)<any>(),
};
