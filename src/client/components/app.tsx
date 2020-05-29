import React from "react";

import { Reduce } from "../../infrastructure/event";

import * as ViewSate from '../viewState';
import { State as AppState } from '../appState';
import { InitialState as InitialContextualState } from '../context';
import { AppView } from './appView';
import { Command } from "../commands";
import { CommandHandler } from "../commandHandler";
import { PushEvent } from "../operations";
import { Flow } from "../flow"


const CompleteCommands: (issueCommandCallback: (command: Command) => void) => (commands: Command[]) => (state: AppState) => AppState = issueCommandCallback => commands => state => {
    if (commands.length == 0)
        return state;

    const events = CommandHandler(state.viewState)(commands[0]);
    const newViewState = Reduce(ViewSate.Reducer)(state.viewState)(events);
    const newContextualState = events.reduce((s, e) => PushEvent(e)(issueCommandCallback)(s), state.contextualState);
    const newCommands = events.reduce<Command[]>((commands, e) => [...commands, ...Flow(e, newViewState)], []);

    return CompleteCommands
        (issueCommandCallback)
        ([...commands.slice(1), ...newCommands])
        ({
            ...state,
            contextualState: newContextualState,
            viewState: newViewState,
        });
}

export class App extends React.Component<ViewSate.State, AppState>{
    constructor(props: ViewSate.State) {
        super(props);
        this.state = {
            viewState: props,
            contextualState: InitialContextualState,
        };
    }

    issueCommand(command: Command) {
        this.setState(state => CompleteCommands(this.issueCommand.bind(this))([command])(state));
    }

    render() { return <AppView state={this.state.viewState} issueCommand={command => this.issueCommand(command)}></AppView>; }
}
