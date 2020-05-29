import * as Union from "../infrastructure/union";

export const Tags = {
    Connecting: "Connecting",
    CheckingLocalPlayerInfo: "CheckingLocalPlayerInfo",
} as const;
export type Tags = typeof Tags;

export type Connecting = Union.Case<Tags["Connecting"], void>;
export type CheckingLocalPlayerInfo = Union.Case<Tags["CheckingLocalPlayerInfo"], void>;

export type Event =
    | Connecting
    | CheckingLocalPlayerInfo

export const Event = {
    Connecting: Union.Case(Tags.Connecting)<void>(),
    CheckingLocalPlayerInfo: Union.Case(Tags.CheckingLocalPlayerInfo)<void>(),
};
