import { Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";

import { Event } from './events'
import { State as Connection } from "./state.connection";
import { State as Login } from "./state.login";

export type State = {
    Connection: Connection,
    Login: Login,
};

export const InitialState: State = {
    Connection: Connection.InitialState,
    Login: Login.InitialState,
};

export const Reducer: EventDef.Reducer<State, Event> = state => event => {
    switch (event.type) {
        case Event.Tags.Connection: return {
            ...state,
            Connection: Connection.Reducer(state.Connection)(event.data),
        };
        case Event.Tags.Login: return {
            ...state,
            Login: Login.Reducer(state.Login)(event.data),
        };
        default: Never(event);
    }
}
