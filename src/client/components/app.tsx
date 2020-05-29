import React from "react";

import { Reduce } from "../../infrastructure/event";

import * as ViewSate from '../viewState';
import { State as AppState } from '../appState';
import { InitialState as InitialContextualState } from '../context';
import { AppView } from './appView';
import { Command } from "../commands";
import { CommandHandler } from "../commandHandler";
import { PushEvent } from "../operations";

export class App extends React.Component<ViewSate.State, AppState>{
    constructor(props: ViewSate.State) {
        super(props);
        this.state = {
            viewState: props,
            contextualState: InitialContextualState,
        };
    }

    issueCommand(command: Command) {
        this.setState(state => {
            const events = CommandHandler(this.state.viewState)(command);
            return {
                ...state,
                contextualState: events.reduce((s, e) => PushEvent(e)(this.issueCommand.bind(this))(s), state.contextualState),
                viewState: Reduce(ViewSate.Reducer)(this.state.viewState)(events)
            };
        })
    }

    render() { return <AppView state={this.state.viewState} issueCommand={command => this.issueCommand(command)}></AppView>; }
}
