import * as Union from "../../infrastructure/union";
import { Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";

import { Event } from "./events.connection";


export namespace State {
    export const Tags = {
        None: "None",
        Connecting: "Connecting",
        Connected: "Connected",
        Failed: "Failed",
    } as const;
    export type Tags = typeof Tags;

    export type None = Union.Case<Tags["None"], void>;
    export const None = Union.Case(Tags.None)<void>();

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type Failed = Union.Case<Tags["Failed"], { reason: string }>;
    export const Failed = Union.Case(Tags.Failed)<{ reason: string }>();

    export const InitialState: State = None();

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        if (event.type == Event.Tags.Rejected)
            return State.Failed(event.data);

        switch (state.type) {
            case Tags.None: return event.type == Event.Tags.Connecting ? Connecting() : state;
            case Tags.Connecting: return event.type == Event.Tags.Connected ? Connected() : state;
            case Tags.Connected: return state;
            case Tags.Failed: return state;
            default: Never(state);
        }
    }

}


export type State =
    | State.None
    | State.Connecting
    | State.Connected
    | State.Failed
