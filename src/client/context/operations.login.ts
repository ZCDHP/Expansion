import { State } from "./state";
import { Event } from "../view/events.login";
import { Command } from "../view/commands";

import { Message } from "../../contracts/message.client";

export const PushEvent: (event: Event) => (onCommand: (command: Command) => void) => (stats: State) => State = event => {
    switch (event.type) {
        case Event.Tags.LoggingIn: return Login();
        default: return _ => state => state;
    }
};

const Login: () => (onCommand: (command: Command) => void) => (stats: State) => State = () => _onCommand => state => {
    state.Connection.connection!.send(JSON.stringify(Message.Login()));

    return state;
};
