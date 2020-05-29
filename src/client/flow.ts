import { Event, Tags as EventTags } from "./events";
import * as ConnectionEvents from "./events.connection";
import * as LoginEvents from "./events.login";

import { Command } from "./commands";

import { State } from "./viewState";
import * as LoginState from "./viewState.login";
import * as ConnectionState from "./viewState.connection";


export const Flow: (event: Event, state: State) => Command[] = (event: Event, state: State) => {
    return ConnectionForLogin(event, state);
};


const ConnectionForLogin: (event: Event, state: State) => Command[] = (event: Event, state: State) => {
    if (event.type == EventTags.Connection && event.data.type == ConnectionEvents.Tags.Connected)
        return state.Login.type == LoginState.Tags.Connecting ? [Command.Login.Connected()] : [];
    else if (event.type == EventTags.Login && event.data.type == LoginEvents.Tags.Connecting) {
        if (state.Connection.type == ConnectionState.Tags.Connected)
            return [Command.Login.Connected()]
        else if (state.Connection.type == ConnectionState.Tags.None)
            return [Command.Connection.Connect()];
        else
            return [];
    }
    else
        return [];
};

