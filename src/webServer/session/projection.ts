import * as Union from "../../infrastructure/union";
import * as Event from "../../infrastructure/event";

import * as Events from './events';
import { Never } from "../../infrastructure/utils";

export const Tags = {
    NotConnected: "NotConnected",
    LoggedOut: "LoggedOut",
    LoggingIn: "LoggingIn",
} as const;
export type Tags = typeof Tags;

export type NotConnected = Union.Case<Tags["NotConnected"], void>;
export type LoggedOut = Union.Case<Tags["LoggedOut"], void>;
export type LoggingIn = Union.Case<Tags["LoggingIn"], { playerId: number }>;

export type State =
    | NotConnected
    | LoggedOut
    | LoggingIn

export const State = {
    NotConnected: Union.Case(Tags.NotConnected)<void>(),
    LoggedOut: Union.Case(Tags.LoggedOut)<void>(),
    LoggingIn: Union.Case(Tags.LoggingIn)<{ playerId: number }>(),
}

export const Reducer: Event.Reducer<State, Events.Event> = state => event => {
    switch (event.type) {
        case Events.Tags.Connected: switch (state.type) {
            case Tags.NotConnected: return State.LoggedOut();
            default: return state;
        }
        case Events.Tags.LoginAttempted: switch (state.type) {
            case Tags.LoggedOut: return State.LoggingIn(event.data);
            default: return state;
        }
        case Events.Tags.ConnectionRejected: return State.NotConnected();
        default: Never(event);
    }
}

export const Projection: Event.Projection<State, Events.Event> = {
    initialState: State.NotConnected(),
    reducer: Reducer
};
