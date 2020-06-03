import { Event, Tags as EventTags } from "../view/events";
import { Command } from "../view/commands";
import { State } from "./state";
import { Message, Tags as MessageTags } from "../message.server";

import { Tags as ConnectionEventTags } from "../view/events.connection";
import { Tags as LoginEventTags } from "../view/events.login";


export const PushEvent: (event: Event) => (onCommand: (command: Command) => void) => (stats: State) => State = event => {
    switch (event.type) {
        case EventTags.Connection: switch (event.data.type) {
            case ConnectionEventTags.Connecting: return Connection_Connect();
            case ConnectionEventTags.Connected:
            default: return _ => state => state;
        }
        case EventTags.Login: switch (event.data.type) {
            case LoginEventTags.CheckingLocalPlayerInfo: return RestoreLocalPlayerInfo();
            default: return _ => state => state;
        }
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

const RestoreLocalPlayerInfo: () => (onCommand: (command: Command) => void) => (stats: State) => State = () => onCommand => state => {
    const playerId = localStorage.getItem("playerId");

    onCommand(Command.Login.RestoredLocalPlayerInfo(playerId ? { playerId: Number(playerId) } : null));

    return state;
};


