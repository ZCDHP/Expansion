import * as Union from "../../infrastructure/union";
import { Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";


export namespace Command {
    export const Tags = {
        Start: "Start",
        Connected: "Connected",
        LoggedIn: "LoggedIn",
        Queued: "Queued",
    } as const;
    export type Tags = typeof Tags;

    export type Start = Union.Case<Tags["Start"], void>;
    export const Start = Union.Case(Tags.Start)<void>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<void>();

    export type Queued = Union.Case<Tags["Queued"], void>;
    export const Queued = Union.Case(Tags.Queued)<void>();

    export const Constructor = {
        Start,
        Connected,
        LoggedIn,
        Queued,
    }
}

export type Command =
    | Command.Start
    | Command.Connected
    | Command.LoggedIn
    | Command.Queued


export namespace Event {
    export const Tags = {
        Connecting: "Connecting",
        LoggingIn: "LoggingIn",
        Queueing: "Queueing",
        Queued: "Queued",
    } as const;
    export type Tags = typeof Tags;

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type LoggingIn = Union.Case<Tags["LoggingIn"], void>;
    export const LoggingIn = Union.Case(Tags.LoggingIn)<void>();

    export type Queueing = Union.Case<Tags["Queueing"], void>;
    export const Queueing = Union.Case(Tags.Queueing)<void>();

    export type Queued = Union.Case<Tags["Queued"], void>;
    export const Queued = Union.Case(Tags.Queued)<void>();

    export const Constructor = {
        Connecting,
        LoggingIn,
        Queueing,
        Queued,
    }
}

export type Event =
    | Event.Connecting
    | Event.LoggingIn
    | Event.Queueing
    | Event.Queued


export namespace State {
    export const Tags = {
        None: "None",
        Connecting: "Connecting",
        LoggingIn: "LoggingIn",
        Queueing: "Queueing",
        Queued: "Queued",
    } as const;
    export type Tags = typeof Tags;

    export type None = Union.Case<Tags["None"], void>;
    export const None = Union.Case(Tags.None)<void>();

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type LoggingIn = Union.Case<Tags["LoggingIn"], void>;
    export const LoggingIn = Union.Case(Tags.LoggingIn)<void>();

    export type Queueing = Union.Case<Tags["Queueing"], void>;
    export const Queueing = Union.Case(Tags.Queueing)<void>();

    export type Queued = Union.Case<Tags["Queued"], void>;
    export const Queued = Union.Case(Tags.Queued)<void>();


    export const Initial: State = None();

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        switch (state.type) {
            case Tags.None: switch (event.type) {
                case Event.Tags.Connecting: return Connecting();
                case Event.Tags.LoggingIn: return LoggingIn();
                case Event.Tags.Queueing: return Queueing();
                default: return state;
            }
            case Tags.Connecting: return event.type == Event.Tags.LoggingIn ? LoggingIn() : state;
            case Tags.LoggingIn: return event.type == Event.Tags.Queueing ? Queueing() : state;
            case Tags.Queueing: return event.type == Event.Tags.Queued ? Queueing() : state;
            case Tags.Queued: return state;
            default: Never(state);
        }
    }

}

export type State =
    | State.None
    | State.Connecting
    | State.LoggingIn
    | State.Queueing
    | State.Queued



