import { Event, Tags as EventTags } from "../view/events";
import { Command } from "../view/commands";
import { State } from "./state";
import { Message, Tags as MessageTags } from "../message.server";

import { Tags as ConnectionEventTags } from "../view/events.connection";

import { PushEvent as LoginOperations } from "./operations.login";


export const PushEvent: (event: Event) => (onCommand: (command: Command) => void) => (stats: State) => State = event => {
    switch (event.type) {
        case EventTags.Connection: switch (event.data.type) {
            case ConnectionEventTags.Connecting: return Connection_Connect();
            case ConnectionEventTags.Connected:
            default: return _ => state => state;
        }
        case EventTags.Login: return LoginOperations(event.data);
        default: return _ => state => state;
    }
};


const Connection_Connect: () => (onCommand: (command: Command) => void) => (stats: State) => State = () => onCommand => state => {
    const protocol = location.protocol === 'https:' ? "wss" : "ws";
    const url = `${protocol}://${location.host}/`;
    const connection = new WebSocket(url);

    connection.onopen = _ => onCommand(Command.Connection.Connected());

    connection.onmessage = e => {
        const message = JSON.parse(e.data as string) as Message;
        switch (message.type) {
            case MessageTags.ConnectionRejected: return onCommand(Command.Connection.Rejected(message.data));
            case MessageTags.ApproveLogin: return onCommand(Command.Login.LoginApproved());
            default: return;
        }
    };

    return {
        ...state,
        Connection: {
            ...state.Connection,
            connection,
        }
    };
}
