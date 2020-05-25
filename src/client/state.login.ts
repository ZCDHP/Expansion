import * as Union from "../infrastructure/union";
import * as Event from "../infrastructure/event";
import * as Events from "./events";

export const Tags = {
    LoggedOut: "LoggedOut",
    LoggingIn: "LoggingIn",
    LoggedIn: "LoggedIn",
} as const;
export type Tags = typeof Tags;

export type LoggedOut = Union.Case<Tags["LoggedOut"], void>;
export type LoggingIn = Union.Case<Tags["LoggingIn"], { id: number }>;
export type LoggedIn = Union.Case<Tags["LoggedIn"], { id: number }>;


export type State =
    | LoggedOut
    | LoggingIn
    | LoggedIn

export const State = {
    LoggedOut: Union.Case(Tags.LoggedOut)<void>(),
    LoggingIn: Union.Case(Tags.LoggingIn)<{ id: number }>(),
    LoggedIn: Union.Case(Tags.LoggedIn)<{ id: number }>(),

}


export const Reducer: Event.Reducer<State, Events.Event> = state => event => {
    switch (event.type) {
        case Events.Tags.LoginAttempted: switch (state.type) {
            case Tags.LoggedOut: return State.LoggingIn(event.data);
            default: return state;
        }
        case Events.Tags.LoggedIn: switch (state.type) {
            case Tags.LoggingIn: return State.LoggedIn(state.data);
            default: return state;
        }
        default: return state;
    }
}

