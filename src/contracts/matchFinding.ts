import * as Union from "../infrastructure/union";

type PlayerId<T> = { playerId: number } & T;

export namespace Command {
    export const Tags = {
        QueuePlayer: "QueuePlayer",
        CancelFinding: "CancelFinding",
    } as const;
    export type Tags = typeof Tags;

    export type QueuePlayer = Union.Case<Tags["QueuePlayer"], PlayerId<{}>>;
    export const QueuePlayer = Union.Case(Tags.QueuePlayer)<PlayerId<{}>>();

    export type CancelFinding = Union.Case<Tags["CancelFinding"], PlayerId<{}>>;
    export const CancelFinding = Union.Case(Tags.CancelFinding)<PlayerId<{}>>();
}

export type Command =
    | Command.QueuePlayer
    | Command.CancelFinding

export namespace Event {
    export const Tags = {
        PlayerQueued: "PlayerQueued",
        FindingCancelled: "FindingCancelled",
        MatchFound: "MatchFound",
    } as const;
    export type Tags = typeof Tags;

    export type PlayerQueued = Union.Case<Tags["PlayerQueued"], PlayerId<{}>>;
    export const PlayerQueued = Union.Case(Tags.PlayerQueued)<PlayerId<{}>>();

    export type FindingCancelled = Union.Case<Tags["FindingCancelled"], PlayerId<{}>>;
    export const FindingCancelled = Union.Case(Tags.FindingCancelled)<PlayerId<{}>>();

    type MatchFoundData = {
        playerIds: [number, number],
    };
    export type MatchFound = Union.Case<Tags["MatchFound"], MatchFoundData>;
    export const MatchFound = Union.Case(Tags.MatchFound)<MatchFoundData>();
}

export type Event =
    | Event.PlayerQueued
    | Event.FindingCancelled
    | Event.MatchFound
