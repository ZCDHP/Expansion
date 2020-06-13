import { Event } from "./domain";
import { State, Command } from "./login";

import { Event as ConnectionEvent } from "./connection";
import { Event as MatchFindingEvent } from "./matchFinding";


export const Subscription: (event: Event) => (state: State) => Command[] = event => {
    switch (event.type) {
        case Event.Tags.Connection: return Connection(event.data)
        case Event.Tags.MatchFinding: return MatchFinding(event.data)
        default: return _ => [];
    }
}

const Connection: (event: ConnectionEvent) => (state: State) => Command[] = event => state => {
    switch (event.type) {
        case ConnectionEvent.Tags.Connected: return state.type == State.Tags.Connecting ? [Command.Connected()] : [];
        default: return [];
    }
};

const MatchFinding: (event: MatchFindingEvent) => (state: State) => Command[] = event => state => {
    switch (event.type) {
        case MatchFindingEvent.Tags.LoggingIn: return state.type == State.Tags.None ? [Command.Start()] : [];
        default: return [];
    }
};
