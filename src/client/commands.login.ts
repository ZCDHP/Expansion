import * as Union from "../infrastructure/union";

export const Tags = {
    Start: "Start",
    Connected: "Connected",
    RestoredLocalPlayerInfo: "RestoredLocalPlayerInfo",
} as const;
export type Tags = typeof Tags;

export type Start = Union.Case<Tags["Start"], void>;
export type Connected = Union.Case<Tags["Connected"], void>;
export type RestoredLocalPlayerInfo = Union.Case<Tags["RestoredLocalPlayerInfo"], { playerId: number } | null>;

export type Command =
    | Start
    | Connected
    | RestoredLocalPlayerInfo

export const Command = {
    Start: Union.Case(Tags.Start)<void>(),
    Connected: Union.Case(Tags.Connected)<void>(),
    RestoredLocalPlayerInfo: Union.Case(Tags.RestoredLocalPlayerInfo)<{ playerId: number } | null>(),
};
