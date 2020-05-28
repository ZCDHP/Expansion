import React from "react";

import * as ViewSate from '../viewState';
import { Operation, Apply } from "../operations";
import { State as AppState } from '../appState';
import { InitialState as InitialContextualState } from '../context';
import { AppView } from './appView';

export class App extends React.Component<ViewSate.State, AppState>{
    constructor(props: ViewSate.State) {
        super(props);
        this.state = {
            viewState: props,
            contextualState: InitialContextualState,
        };
    }

    applyOperation(operation: Operation) {
        this.setState(Apply(operation)(op => this.applyOperation(op))(this.state));
    }

    render() { return <AppView state={this.state.viewState} applyOption={operation => this.applyOperation(operation)}></AppView>; }
}
