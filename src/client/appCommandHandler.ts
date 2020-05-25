import { Reduce } from "../infrastructure/event";

import * as ViewState from './state';
import { State as AppState } from './appState';
import { Command } from './commands';

import { CommandHandler as ViewCommandHandler } from './commandHandler';

export const CommandHandler: (cmd: Command) => (state: AppState) => AppState = cmd => state => {
    const events = ViewCommandHandler(state.viewState)(cmd);
    return {
        ...state,
        viewState: Reduce(ViewState.Reducer)(state.viewState)(events)
    };
}
