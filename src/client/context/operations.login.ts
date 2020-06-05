import { State } from "./state";
import { Event, Tags as EventTags } from "../view/events.login";
import { Command } from "../view/commands";

import { Message } from "../message.client";

export const PushEvent: (event: Event) => (onCommand: (command: Command) => void) => (stats: State) => State = event => {
    switch (event.type) {
        case EventTags.LoggingIn: return Login();
        default: return _ => state => state;
    }
};

const Login: () => (onCommand: (command: Command) => void) => (stats: State) => State = () => _onCommand => state => {
    state.Connection.connection!.send(JSON.stringify(Message.Login()));

    return state;
};
