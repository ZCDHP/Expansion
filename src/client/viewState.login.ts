import * as Union from "../infrastructure/union";
import { Never } from "../infrastructure/utils";
import * as EventDef from "../infrastructure/event";

import { Event, Tags as EventTags } from "./events.login";

export const Tags = {
    None: "None",
    Connecting: "Connecting",
    CheckingLocalPlayerInfo: "CheckingLocalPlayerInfo",
} as const;
export type Tags = typeof Tags;

export type None = Union.Case<Tags["None"], void>;
export type Connecting = Union.Case<Tags["Connecting"], void>;
export type CheckingLocalPlayerInfo = Union.Case<Tags["CheckingLocalPlayerInfo"], void>;

export type State =
    | None
    | Connecting
    | CheckingLocalPlayerInfo

export const State = {
    None: Union.Case(Tags.None)<void>(),
    Connecting: Union.Case(Tags.Connecting)<void>(),
    CheckingLocalPlayerInfo: Union.Case(Tags.CheckingLocalPlayerInfo)<void>(),
}

export const InitialState: State = State.None();

export const Reducer: EventDef.Reducer<State, Event> = state => event => {
    switch (state.type) {
        case Tags.None: return event.type == EventTags.Connecting ? State.Connecting() : state;
        case Tags.Connecting: return event.type == EventTags.CheckingLocalPlayerInfo ? State.CheckingLocalPlayerInfo() : state;
        case Tags.CheckingLocalPlayerInfo: return state;
        default: Never(state);
    }
}

