import * as Union from "../../infrastructure/union";

export const Tags = {
    Connected: "Connected",
    Anything: "Anything",
} as const;
export type Tags = typeof Tags;


export type Connected = Union.Case<Tags["Connected"], void>;
export type Anything = Union.Case<Tags["Anything"], any>;

export type Event =
    | Connected
    | Anything

export const Event = {
    Connected: Union.Case(Tags.Connected)<void>(),
    Anything: Union.Case(Tags.Anything)<any>(),
};
