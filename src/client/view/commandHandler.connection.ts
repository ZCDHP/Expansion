import { Never } from "../../infrastructure/utils";

import { State as ViewState } from "./state";
import { State as ConnectionState } from "./state.connection";
import { Event } from './events'
import { Event as ConnectionEvent } from './events.connection'
import { Command } from './commands';
import { Command as ConnectionCommand } from './commands.connection';

export const CommandHandler: (state: ViewState) => (cmd: Command) => Event[] = state => cmd => {
    if (cmd.type == Command.Tags.Connection)
        return CommandHandler_Inner(state.Connection)(cmd.data).map(Event.Connection);
    return [];
};


const CommandHandler_Inner: (state: ConnectionState) => (cmd: ConnectionCommand) => ConnectionEvent[] = state => cmd => {
    switch (cmd.type) {
        case ConnectionCommand.Tags.Connecting: return state.type == ConnectionState.Tags.None ? [ConnectionEvent.Connecting()] : [];
        case ConnectionCommand.Tags.Connected: return state.type == ConnectionState.Tags.Connecting ? [ConnectionEvent.Connected()] : [];
        case ConnectionCommand.Tags.Rejected: return [ConnectionEvent.Rejected(cmd.data)];
        default: Never(cmd);
    }
}
