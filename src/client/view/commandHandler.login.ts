import { Never } from "../../infrastructure/utils";

import { State as ViewState } from "./state";
import { Tags as ConnectionStateTags } from "./state.connection";
import { Tags as LoginStateTags } from "./state.login";
import { Event } from './events'
import { Command, Tags as CommandTags } from './commands';
import { Command as ConnectionCommand, Tags as ConnectionCommandTags } from './commands.connection';
import { Command as LoginCommand, Tags as LoginCommandTags } from './commands.login';

export const CommandHandler: (state: ViewState) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case CommandTags.Connection: return HandleConnectionCommands(state)(cmd.data);
        case CommandTags.Login: return HandleLoginCommands(state)(cmd.data);
        default: return [];
    }
};

const HandleConnectionCommands: (state: ViewState) => (cmd: ConnectionCommand) => Event[] = state => cmd => {
    switch (cmd.type) {
        case ConnectionCommandTags.Connected: return state.Login.type == LoginStateTags.Connecting ? [Event.Login.CheckingLocalPlayerInfo()] : [];
        default: return [];
    }
}

const HandleLoginCommands: (state: ViewState) => (cmd: LoginCommand) => Event[] = state => cmd => {
    switch (cmd.type) {
        case LoginCommandTags.Start: {
            if (state.Login.type != LoginStateTags.None)
                return [];
            return state.Connection.type == ConnectionStateTags.Connected ?
                [Event.Login.CheckingLocalPlayerInfo()] :
                [Event.Login.Connecting(), Event.Connection.Connecting()];
        }
        case LoginCommandTags.Connected: return state.Login.type == LoginStateTags.Connecting ? [Event.Login.CheckingLocalPlayerInfo()] : [];
        case LoginCommandTags.RestoredLocalPlayerInfo: return [];
        default: Never(cmd);
    }
}
