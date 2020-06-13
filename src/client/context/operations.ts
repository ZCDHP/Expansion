import { Event } from "../view/events";
import { Command } from "../view/commands";
import { State } from "./state";
import { Message } from "../../contracts/message.server";

import { Event as ConnectionEvent } from "../view/events.connection";

import { PushEvent as LoginOperations } from "./operations.login";


export const PushEvent: (event: Event) => (issueCommand: (command: Command) => void) => (stats: State) => State = event => {
    switch (event.type) {
        case Event.Tags.Connection: switch (event.data.type) {
            case ConnectionEvent.Tags.Connecting: return Connection_Connect();
            case ConnectionEvent.Tags.Connected:
            default: return _ => state => state;
        }
        case Event.Tags.Login: return LoginOperations(event.data);
        default: return _ => state => state;
    }
};


const Connection_Connect: () => (issueCommand: (command: Command) => void) => (stats: State) => State = () => issueCommand => state => {
    const protocol = location.protocol === 'https:' ? "wss" : "ws";
    const url = `${protocol}://${location.host}/`;
    const connection = new WebSocket(url);

    connection.onopen = _ => issueCommand(Command.Constructor.Connection.Connected());

    connection.onmessage = e => {
        const message = JSON.parse(e.data as string) as Message;
        switch (message.type) {
            case Message.Tags.ConnectionRejected: return issueCommand(Command.Constructor.Connection.Rejected(message.data));
            case Message.Tags.ApproveLogin: return issueCommand(Command.Constructor.Login.LoginApproved());
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
