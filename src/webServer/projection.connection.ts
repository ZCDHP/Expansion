import ws from 'ws';

import { Reducer, Projection as Proj } from '../infrastructure/event';


import { Event, Tags as EventTags } from './session/events';
import { Message } from "../client/message.server";

export type State = {
    connection: ws,
    close: boolean,
};

export const Reduce: Reducer<State, Event> = state => event => {
    switch (event.type) {
        case EventTags.ConnectionRejected:
            state.connection.send(JSON.stringify(Message.ConnectionRejected(event.data)));
            return {
                ...state,
                close: true,
            };
        default: return state;
    };
}

export const Projection: (connection: ws) => Proj<State, Event> = (connection: ws) => ({
    initialState: {
        connection,
        close: false,
    },
    reducer: Reduce,
});
