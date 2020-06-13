import * as Union from "../../infrastructure/union";
import { Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";

import { Event } from "./events.login";

export namespace State {
    export const Tags = {
        None: "None",
        Connecting: "Connecting",
        LoggingIn: "LoggingIn",
        LoggedIn: "LoggedIn",
    } as const;
    export type Tags = typeof Tags;

    export type None = Union.Case<Tags["None"], void>;
    export const None = Union.Case(Tags.None)<void>();

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type LoggingIn = Union.Case<Tags["LoggingIn"], void>;
    export const LoggingIn = Union.Case(Tags.LoggingIn)<void>();

    export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<void>();


    export const InitialState: State = None();

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        switch (state.type) {
            case Tags.None: switch (event.type) {
                case Event.Tags.Connecting: return Connecting();
                case Event.Tags.LoggingIn: return LoggingIn();
                default: return state;
            }
            case Tags.Connecting: return event.type == Event.Tags.LoggingIn ? LoggingIn() : state;
            case Tags.LoggingIn: return event.type == Event.Tags.LoggedIn ? LoggedIn() : state;;
            case Tags.LoggedIn: return state;
            default: Never(state);
        }
    }

}

export type State =
    | State.None
    | State.Connecting
    | State.LoggingIn
    | State.LoggedIn
