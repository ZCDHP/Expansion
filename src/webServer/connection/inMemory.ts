import ws from 'ws';

import { Message as ServerMessage } from "../../client/message.server";

export type State = {
    [id: number]: ws,
};

export const InitialState: State = {}

export type Operation = (state: State) => State;

export const Composition: (...operations: Operation[]) => Operation = (...operations: Operation[]) => state => operations.reduce<State>((s, op) => op(s), state);

export const Add: (id: number) => (connection: ws) => Operation = id => connection => state => {
    return {
        ...state,
        [id]: connection,
    };
}

export const Disconnect: (id: number) => Operation = id => state => {
    state[id].onerror = _ => { };
    state[id].onmessage = _ => { };
    state[id].onclose = _ => { };

    state[id].close();

    const newState = { ...state };
    delete newState[id];

    return newState;
}

export const Send: (id: number) => (message: ServerMessage) => Operation = id => message => state => {
    state[id].send(JSON.stringify(message));
    return state;
}

export const Operations = {
    Composition,
    Add,
    Disconnect,
    Send,
};
