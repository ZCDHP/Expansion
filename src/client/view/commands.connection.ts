import * as Union from "../../infrastructure/union";


export namespace Command {
    export const Tags = {
        Connecting: "Connecting",
        Connected: "Connected",
        Rejected: "Rejected",
    } as const;
    export type Tags = typeof Tags;

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type Rejected = Union.Case<Tags["Rejected"], { reason: string }>;
    export const Rejected = Union.Case(Tags.Rejected)<{ reason: string }>();


    export const Constructor = {
        Connecting,
        Connected,
        Rejected,
    }
}

export type Command =
    | Command.Connecting
    | Command.Connected
    | Command.Rejected
