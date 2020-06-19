import * as Union from "../../infrastructure/union";
import { Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";


export namespace Command {
    export const Tags = {
        Queue: "Queue",
        Queued: "Queued",
        MatchFound: "MatchFound",
    } as const;
    export type Tags = typeof Tags;

    export type Queue = Union.Case<Tags["Queue"], void>;
    export const Queue = Union.Case(Tags.Queue)<void>();

    export type Queued = Union.Case<Tags["Queued"], void>;
    export const Queued = Union.Case(Tags.Queued)<void>();

    type MatchFoundData = {
        matchId: number,
    }
    export type MatchFound = Union.Case<Tags["MatchFound"], MatchFoundData>;
    export const MatchFound = Union.Case(Tags.MatchFound)<MatchFoundData>();

    export const Constructor = {
        Queue,
        Queued,
        MatchFound,
    }
}

export type Command =
    | Command.Queue
    | Command.Queued
    | Command.MatchFound


export namespace Event {
    export const Tags = {
        Queueing: "Queueing",
        Queued: "Queued",
    } as const;
    export type Tags = typeof Tags;

    export type Queueing = Union.Case<Tags["Queueing"], void>;
    export const Queueing = Union.Case(Tags.Queueing)<void>();

    export type Queued = Union.Case<Tags["Queued"], void>;
    export const Queued = Union.Case(Tags.Queued)<void>();

    export const Constructor = {
        Queueing,
        Queued,
    }
}

export type Event =
    | Event.Queueing
    | Event.Queued


export namespace State {
    export const Tags = {
        None: "None",
        Queueing: "Queueing",
        Queued: "Queued",
    } as const;
    export type Tags = typeof Tags;

    export type None = Union.Case<Tags["None"], void>;
    export const None = Union.Case(Tags.None)<void>();

    export type Queueing = Union.Case<Tags["Queueing"], void>;
    export const Queueing = Union.Case(Tags.Queueing)<void>();

    export type Queued = Union.Case<Tags["Queued"], void>;
    export const Queued = Union.Case(Tags.Queued)<void>();


    export const Initial: State = None();

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        switch (state.type) {
            case Tags.None: return event.type == Event.Tags.Queueing ? Queueing() : state;
            case Tags.Queueing: return event.type == Event.Tags.Queued ? Queued() : state;
            case Tags.Queued: return state;
            default: Never(state);
        }
    }
}

export type State =
    | State.None
    | State.Queueing
    | State.Queued


export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case Command.Tags.Queue: return state.type == State.Tags.None ? [Event.Queueing()] : [];
        case Command.Tags.Queued: return state.type == State.Tags.Queueing ? [Event.Queued()] : [];
        case Command.Tags.MatchFound: console.log("Match Found"); return [];
        default: Never(cmd);
    }
}
