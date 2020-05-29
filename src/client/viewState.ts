import { Never } from "../infrastructure/utils";
import * as EventDef from "../infrastructure/event";

import { Event, Tags as EventTags } from './events'
import * as Connection from "./viewState.connection";
import * as Login from "./viewState.login";

export type State = {
    Connection: Connection.State,
    Login: Login.State,
};

export const InitialState: State = {
    Connection: Connection.InitialState,
    Login: Login.InitialState,
};

export const Reducer: EventDef.Reducer<State, Event> = state => event => {
    switch (event.type) {
        case EventTags.Connection: return {
            ...state,
            Connection: Connection.Reducer(state.Connection)(event.data),
        };
        case EventTags.Login: return {
            ...state,
            Login: Login.Reducer(state.Login)(event.data),
        };
        default: Never(event);
    }
}
