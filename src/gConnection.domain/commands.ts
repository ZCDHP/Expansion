import * as Union from "../infrastructure/union";


export const Tags = {
    Connect: "Connect",
    Disconnect: "Disconnect",
} as const;
export type Tags = typeof Tags;

export type Connect = Union.Case<Tags["Connect"], void>;
export type Disconnect = Union.Case<Tags["Disconnect"], void>;

export type Command =
    | Connect
    | Disconnect

export const Command = {
    Connect: Union.Case(Tags.Connect)<void>(),
    Disconnect: Union.Case(Tags.Disconnect)<void>(),
}
