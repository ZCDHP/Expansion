import { Command, Event, State } from "./domain";

import { Subscription as Connection } from "./connection.subscription";
import { Subscription as Login } from "./login.subscription";
import { Subscription as MatchFinding } from "./matchFinding.subscription";

export const Subscription: (event: Event) => (state: State) => Command[] = event => state => [
    ...Connection(event)(state.Connection).map(Command.Connection),
    ...Login(event)(state.Login).map(Command.Login),
    ...MatchFinding(event)(state.MatchFinding).map(Command.MatchFinding),
];
