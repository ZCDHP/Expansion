import ws from 'ws';

import { Message as ServerMessage } from "../../client/message.server";

export type State = {
    [id: number]: ws,
};

export const InitialState: State = {}

export type Operation = (state: State) => State;

export const Composition: (...operations: Operation[]) => Operation = (...operations: Operation[]) => state => operations.reduce<State>((s, op) => op(s), state);

export const Add: (id: number) => (connection: ws) => Operation = id => connection => state => {
    //connection.onmessage = e => onMessage(JSON.parse(e.data as string));
    return {
        ...state,
        [id]: connection,
    };
}

export const Send: (id: number) => (message: ServerMessage) => Operation = id => message => state => {
    state[id].send(JSON.stringify(message));
    return state;
}

export const Operations = {
    Composition,
    Add,
    Send,
};
