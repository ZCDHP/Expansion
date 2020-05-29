import * as Union from "../infrastructure/union";
import { Never } from "../infrastructure/utils";
import * as EventDef from "../infrastructure/event";

import { Event, Tags as EventTags } from "./events.connection";

export const Tags = {
    None: "None",
    Connecting: "Connecting",
    Connected: "Connected",
    Failed: "Failed",
} as const;
export type Tags = typeof Tags;

export type None = Union.Case<Tags["None"], void>;
export type Connecting = Union.Case<Tags["Connecting"], void>;
export type Connected = Union.Case<Tags["Connected"], void>;
export type Failed = Union.Case<Tags["Failed"], { reason: string }>;

export type State =
    | None
    | Connecting
    | Connected
    | Failed

export const State = {
    None: Union.Case(Tags.None)<void>(),
    Connecting: Union.Case(Tags.Connecting)<void>(),
    Connected: Union.Case(Tags.Connected)<void>(),
    Failed: Union.Case(Tags.Failed)<{ reason: string }>(),
}

export const InitialState: State = State.None();

export const Reducer: EventDef.Reducer<State, Event> = state => event => {
    if (event.type == EventTags.Rejected)
        return State.Failed(event.data);

    switch (state.type) {
        case Tags.None: return event.type == EventTags.Connecting ? State.Connecting() : state;
        case Tags.Connecting: return event.type == EventTags.Connected ? State.Connected() : state;
        case Tags.Connected: return state;
        case Tags.Failed: return state;
        default: Never(state);
    }
}
