import * as Union from "../../infrastructure/union";


export const Tags = {
    Connect: "Connect",
    Anything: "Anything",
} as const;
export type Tags = typeof Tags;

export type Connect = Union.Case<Tags["Connect"], void>;
export type Anything = Union.Case<Tags["Anything"], any>;

export type Command =
    | Connect
    | Anything

export const Command = {
    Connect: Union.Case(Tags.Connect)<void>(),
    Anything: Union.Case(Tags.Anything)<any>(),
}
