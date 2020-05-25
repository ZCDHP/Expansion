import { Reduce, Reducer as R } from "../infrastructure/event";

import * as ViewState from './state';
import { State as AppState } from './appState';
import { Event, Tags as EventTags } from "./events";
import { Command } from './commands';

import { CommandHandler as ViewCommandHandler } from './commandHandler';

export const CommandHandler: (cmd: Command) => (state: AppState) => AppState = cmd => state => {
    const events = ViewCommandHandler(state.viewState)(cmd);
    return {
        ...Reduce(Reducer)(state)(events),
        viewState: Reduce(ViewState.Reducer)(state.viewState)(events)
    };
}

const Reducer: R<AppState, Event> = state => event => {
    switch (event.type) {
        case EventTags.LoginAttempted:
            const protocol = location.protocol === 'https:' ? "wss" : "ws";
            const url = `${protocol}://${location.host}/`;
            const connection = new WebSocket(url);
            return {
                ...state,
                connection,
            }
        default: return state;
    }
}
