import * as Union from "../../infrastructure/union";

export const Tags = {
    Connected: "Connected",
    Disconnected: "Disconnected",
    Anything: "Anything",
} as const;
export type Tags = typeof Tags;


export type Connected = Union.Case<Tags["Connected"], void>;
export type Disconnected = Union.Case<Tags["Disconnected"], void>;
export type Anything = Union.Case<Tags["Anything"], any>;

export type Event =
    | Connected
    | Disconnected
    | Anything

export const Event = {
    Connected: Union.Case(Tags.Connected)<void>(),
    Disconnected: Union.Case(Tags.Disconnected)<void>(),
    Anything: Union.Case(Tags.Anything)<any>(),
};
