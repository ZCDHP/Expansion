import * as Union from "../../infrastructure/union";
import * as Event from "../../infrastructure/event";

import * as Events from './events';
import { Never } from "../../infrastructure/utils";

export const Tags = {
    NotConnected: "NotConnected",
    LoggedOut: "LoggedOut",
} as const;
export type Tags = typeof Tags;

export type NotConnected = Union.Case<Tags["NotConnected"], void>;
export type LoggedOut = Union.Case<Tags["LoggedOut"], void>;
export type State =
    | NotConnected
    | LoggedOut
export const State = {
    NotConnected: Union.Case(Tags.NotConnected)<void>(),
    LoggedOut: Union.Case(Tags.LoggedOut)<void>(),
}

export const Reducer: Event.Reducer<State, Events.Event> = state => event => {
    switch (event.type) {
        case Events.Tags.Connected: switch (state.type) {
            case Tags.NotConnected: return State.LoggedOut();
            default: return state;
        }
        case Events.Tags.Disconnected: return State.NotConnected();
        case Events.Tags.Anything: return state;
        default: Never(event);
    }
}

export const Projection: Event.Projection<State, Events.Event> = {
    initialState: State.NotConnected(),
    reducer: Reducer
};
