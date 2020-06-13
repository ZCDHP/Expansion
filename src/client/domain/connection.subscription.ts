import { Event } from "./domain";
import { State, Command } from "./connection";

import { Event as LoginEvent } from "./login";
import { Event as MatchFindingEvent } from "./matchFinding";


export const Subscription: (event: Event) => (state: State) => Command[] = event => {
    switch (event.type) {
        case Event.Tags.Login: return Login(event.data)
        case Event.Tags.MatchFinding: return MatchFinding(event.data)
        default: return _ => [];
    }
}

const Login: (event: LoginEvent) => (state: State) => Command[] = event => state => {
    switch (event.type) {
        case LoginEvent.Tags.Connecting: return DoConnect(state);
        default: return [];
    }
};

const MatchFinding: (event: MatchFindingEvent) => (state: State) => Command[] = event => state => {
    switch (event.type) {
        case LoginEvent.Tags.Connecting: return DoConnect(state);
        default: return [];
    }
};


const DoConnect: (state: State) => Command[] = state => state.type == State.Tags.None ? [Command.Connect()] : [];;
