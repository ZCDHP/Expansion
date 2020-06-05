import * as Union from "../../infrastructure/union";
import { Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";

import { Event, Tags as EventTags } from "./events.login";

export const Tags = {
    None: "None",
    Connecting: "Connecting",
    LoggingIn: "LoggingIn",
    LoggedIn: "LoggedIn",
} as const;
export type Tags = typeof Tags;

export type None = Union.Case<Tags["None"], void>;
export type Connecting = Union.Case<Tags["Connecting"], void>;
export type LoggingIn = Union.Case<Tags["LoggingIn"], void>;
export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;

export type State =
    | None
    | Connecting
    | LoggingIn
    | LoggedIn

export const State = {
    None: Union.Case(Tags.None)<void>(),
    Connecting: Union.Case(Tags.Connecting)<void>(),
    LoggingIn: Union.Case(Tags.LoggingIn)<void>(),
    LoggedIn: Union.Case(Tags.LoggedIn)<void>(),
}

export const InitialState: State = State.None();

export const Reducer: EventDef.Reducer<State, Event> = state => event => {
    switch (state.type) {
        case Tags.None: switch (event.type) {
            case EventTags.Connecting: return State.Connecting();
            case EventTags.LoggingIn: return State.LoggingIn();
            default: return state;
        }
        case Tags.Connecting: return event.type == EventTags.LoggingIn ? State.LoggingIn() : state;
        case Tags.LoggingIn: return event.type == EventTags.LoggedIn ? State.LoggedIn() : state;;
        case Tags.LoggedIn: return state;
        default: Never(state);
    }
}

