import * as Union from "../infrastructure/union";

export const Tags = {
    ConnectionRejected: "ConnectionRejected",
    Anything: "Anything",
} as const;
export type Tags = typeof Tags;


export type ConnectionRejected = Union.Case<Tags["ConnectionRejected"], { reason: string }>;
export type Anything = Union.Case<Tags["Anything"], any>;

export type Message =
    | ConnectionRejected
    | Anything

export const Message = {
    ConnectionRejected: Union.Case(Tags.ConnectionRejected)<{ reason: string }>(),
    Anything: Union.Case(Tags.Anything)<any>(),
};
