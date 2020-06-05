import React from "react";

import { Reduce } from "../../infrastructure/event";

import * as ViewSate from '../view/state';
import { State as AppState } from '../appState';
import { InitialState as InitialContextualState } from '../context/state';
import { AppView } from './appView';
import { Command } from "../view/commands";
import { CommandHandler } from "../view/commandHandler";
import { PushEvent } from "../context/operations";


const CompleteCommands: (issueCommandCallback: (command: Command) => void) => (commands: Command[]) => (state: AppState) => AppState = issueCommandCallback => commands => state => {
    if (commands.length == 0)
        return state;

    const events = CommandHandler(state.viewState)(commands[0]);
    const newViewState = Reduce(ViewSate.Reducer)(state.viewState)(events);
    const newContextualState = events.reduce((s, e) => PushEvent(e)(issueCommandCallback)(s), state.contextualState);

    return CompleteCommands
        (issueCommandCallback)
        ([...commands.slice(1)])
        ({
            ...state,
            contextualState: newContextualState,
            viewState: newViewState,
        });
}

export const App = (initialViewState: ViewSate.State) => {
    const [state, setState] = React.useState<AppState>({
        viewState: initialViewState,
        contextualState: InitialContextualState,
    });

    const issueCommand = (command: Command) => setState(CompleteCommands(issueCommand)([command]));

    return <AppView state={state.viewState} issueCommand={command => issueCommand(command)}></AppView>;
}
