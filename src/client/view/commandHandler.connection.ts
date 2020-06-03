import { Never } from "../../infrastructure/utils";

import { State as ViewState } from "./state";
import { State as ConnectionState, Tags as ConnectionStateTags } from "./state.connection";
import { Event, Connection } from './events'
import { Event as ConnectionEvent } from './events.connection'
import { Command, Tags as CommandTags } from './commands';
import { Command as ConnectionCommand, Tags as ConnectionCommandTags } from './commands.connection';

export const CommandHandler: (state: ViewState) => (cmd: Command) => Event[] = state => cmd => {
    if (cmd.type == CommandTags.Connection)
        return CommandHandler_Inner(state.Connection)(cmd.data).map(Connection);
    return [];
};


const CommandHandler_Inner: (state: ConnectionState) => (cmd: ConnectionCommand) => ConnectionEvent[] = state => cmd => {
    switch (cmd.type) {
        case ConnectionCommandTags.Connecting: return state.type == ConnectionStateTags.None ? [ConnectionEvent.Connecting()] : [];
        case ConnectionCommandTags.Connected: return state.type == ConnectionStateTags.Connecting ? [ConnectionEvent.Connected()] : [];
        case ConnectionCommandTags.Rejected: return [ConnectionEvent.Rejected(cmd.data)];
        default: Never(cmd);
    }
}
