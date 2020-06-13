import ws from 'ws';
import { Map } from "../../infrastructure/map";

import { Message as ServerMessage } from "../../contracts/serverMessage";

import { Event } from "./events";



export namespace State {
    type Transformation = (s: State) => State;
    type EventHandler = (e: Event) => void;

    export const Empty: () => State = Map.Empty;

    export const AddConnection: (eventHandler: EventHandler) => (connectionId: number) => (connection: ws) => Transformation = eventHandler => connectionId => connection => {
        eventHandler(Event.Connected(connectionId));

        connection.onmessage = e => eventHandler(Event.MessageReceived(connectionId, JSON.parse(e.data as string)));

        return Map.Set(connectionId, connection);
    }

    export const Send: (connectionId: number) => (message: ServerMessage) => Transformation = connectionId => message => state => {
        const connection = state[connectionId];
        if (!connection)
            return state;

        connection.send(JSON.stringify(message));

        return state;
    }

    export const Close: (eventHandler: EventHandler) => (connectionId: number) => Transformation = eventHandler => connectionId => state => {
        const connection = state[connectionId];
        if (!connection)
            return state;

        eventHandler(Event.Disconnected(connectionId));

        connection.removeAllListeners();
        connection.close();

        return Map.Remove(connectionId)(state);
    }
}

export type State = Map<number, ws>
