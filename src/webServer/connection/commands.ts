import * as Union from "../../infrastructure/union";


export const Tags = {
    Connect: "Connect",
    Disconnect: "Disconnect",
    Anything: "Anything",
} as const;
export type Tags = typeof Tags;

export type Connect = Union.Case<Tags["Connect"], void>;
export type Disconnect = Union.Case<Tags["Disconnect"], void>;
export type Anything = Union.Case<Tags["Anything"], any>;

export type Command =
    | Connect
    | Disconnect
    | Anything

export const Command = {
    Connect: Union.Case(Tags.Connect)<void>(),
    Disconnect: Union.Case(Tags.Disconnect)<void>(),
    Anything: Union.Case(Tags.Anything)<any>(),
}
