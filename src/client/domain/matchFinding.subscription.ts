import { Event } from "./domain";
import { State, Command } from "./matchFinding";

import { Event as ConnectionEvent } from "./connection";
import { Event as LoginEvent } from "./login";


export const Subscription: (event: Event) => (state: State) => Command[] = event => {
    switch (event.type) {
        case Event.Tags.Connection: return Connection(event.data)
        case Event.Tags.Login: return Login(event.data)
        default: return _ => [];
    }
}

const Connection: (event: ConnectionEvent) => (state: State) => Command[] = event => state => {
    switch (event.type) {
        case ConnectionEvent.Tags.Connected: return state.type == State.Tags.Connecting ? [Command.Connected()] : [];
        default: return [];
    }
};

const Login: (event: LoginEvent) => (state: State) => Command[] = event => state => {
    switch (event.type) {
        case LoginEvent.Tags.LoggedIn: return state.type == State.Tags.LoggingIn ? [Command.LoggedIn()] : [];
        default: return [];
    }
};

