import * as Event from "../infrastructure/event";
import * as Events from "./events";

import * as LoginState from "./state.login";

export type State = {
    login: LoginState.State,
}

export const Reducer: Event.Reducer<State, Events.Event> = state => event => ({
    login: LoginState.Reducer(state.login)(event),
});
