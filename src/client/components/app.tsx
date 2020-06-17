import React from "react";

import { Reduce } from "../../infrastructure/event";


import * as Domain from "../domain/domain";
import * as Context from "../context/context";

import { AppView } from './appView';

type State = [Domain.State, Context.State]

const ExecuteCommand: (issueCommand: (command: Domain.Command) => void) => (command: Domain.Command) => (state: State) => State = issueCommand => command => ([domain, context]) => {
    const events = Domain.CommandHandler(domain)(command);

    events.forEach(x => console.dir(x));

    const newDomain = Reduce(Domain.State.Reducer)(domain)(events);
    const newContext = events.reduce((c, event) => Context.Subscription(issueCommand)(event)(c), context);

    return Domain.Event.ExtractCommands(events)
        .reduce<[Domain.State, Context.State]>((state, cmd) => ExecuteCommand(issueCommand)(cmd)(state), [newDomain, newContext]);
};

export const App = (initialState: Domain.State) => {
    let [state, setState] = React.useState<[Domain.State, Context.State]>([initialState, Context.State.Initial()]);

    const issueCommand = (command: Domain.Command) => setState(ExecuteCommand(issueCommand)(command));

    return <AppView state={state[0]} issueCommand={command => issueCommand(command)}></AppView>;
}
