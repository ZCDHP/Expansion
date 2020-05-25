import React from "react";

import * as ViewSate from '../state';
import { State as AppState } from '../appState';
import { AppView } from './appView';
import { CommandHandler } from '../appCommandHandler';

export class App extends React.Component<ViewSate.State, AppState>{
    constructor(props: ViewSate.State) {
        super(props);
        this.state = {
            viewState: props,
            issueCommand: cmd => this.setState(CommandHandler(cmd)),
        };
    }

    render() { return <AppView state={this.state.viewState} issueCommand={this.state.issueCommand}></AppView>; }
}
