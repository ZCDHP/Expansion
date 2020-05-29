import { Event, Tags as EventTags } from "./events.connection";
import { Command } from "./commands";
import { State } from "./context.connection";
import { Message, Tags as MessageTags } from "./message.server";

export const PushEvent: (event: Event) => (onCommand: (command: Command) => void) => (stats: State) => State = event => {
    switch (event.type) {
        case EventTags.Connecting: return Connect();
        default: return _ => state => state;
    }
};

const Connect: () => (onCommand: (command: Command) => void) => (stats: State) => State = () => onCommand => _state => {
    const protocol = location.protocol === 'https:' ? "wss" : "ws";
    const url = `${protocol}://${location.host}/`;
    const connection = new WebSocket(url);

    connection.onopen = _ => onCommand(Command.Connection.Connected());

    connection.onmessage = e => {
        const message = JSON.parse(e.data as string) as Message;
        switch (message.type) {
            case MessageTags.ConnectionRejected: return onCommand(Command.Connection.Rejected(message.data));
            default: return;
        }
    };

    return {
        connection,
    };
}
