import * as Union from "../infrastructure/union";
import * as Event from "../infrastructure/event";

import * as Events from './events';
import { Never } from "../infrastructure/utils";

export const Tags = {
    Connected: "Connected",
    NotConnected: "NotConnected",
} as const;
export type Tags = typeof Tags;

export type Connected = Union.Case<Tags["Connected"], void>;
const Connected = Union.Case(Tags.Connected)<void>();

export type NotConnected = Union.Case<Tags["NotConnected"], void>;
const NotConnected = Union.Case(Tags.NotConnected)<void>();

export type State =
    | Connected
    | NotConnected

export const State = {
    Connected,
    NotConnected,
}

export const Reducer: Event.Reducer<State, Events.Event> = _state => event => {
    switch (event.type) {
        case Events.Tags.Connected: return Connected();
        case Events.Tags.Rejected: return NotConnected();
        case Events.Tags.Disconnected: return NotConnected();
        default: Never(event);
    }
}

export const Projection: Event.Projection<State, Events.Event> = {
    initialState: NotConnected(),
    reducer: Reducer
};
