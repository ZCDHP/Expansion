import { Never } from "../../infrastructure/utils";

import { State as ViewState } from "./state";
import { State as ConnectionState } from "./state.connection";
import { State as LoginState } from "./state.login";
import { Event } from './events'
import { Command } from './commands';
import { Command as ConnectionCommand } from './commands.connection';
import { Command as LoginCommand } from './commands.login';

export const CommandHandler: (state: ViewState) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case Command.Tags.Connection: return HandleConnectionCommands(state)(cmd.data);
        case Command.Tags.Login: return HandleLoginCommands(state)(cmd.data);
        default: return [];
    }
};

const HandleConnectionCommands: (state: ViewState) => (cmd: ConnectionCommand) => Event[] = state => cmd => {
    switch (cmd.type) {
        case ConnectionCommand.Tags.Connected: return state.Login.type == LoginState.Tags.Connecting ? [Event.Constructor.Login.LoggingIn()] : [];
        default: return [];
    }
}

const HandleLoginCommands: (state: ViewState) => (cmd: LoginCommand) => Event[] = state => cmd => {
    switch (cmd.type) {
        case LoginCommand.Tags.Start: {
            if (state.Login.type != LoginState.Tags.None)
                return [];
            return state.Connection.type == ConnectionState.Tags.Connected ?
                [Event.Constructor.Login.LoggingIn()] :
                [Event.Constructor.Login.Connecting(), Event.Constructor.Connection.Connecting()];
        }
        case LoginCommand.Tags.Connected: return state.Login.type == LoginState.Tags.Connecting ? [Event.Constructor.Login.LoggingIn()] : [];
        case LoginCommand.Tags.Login: return (state.Login.type == LoginState.Tags.None || state.Login.type == LoginState.Tags.Connecting) ? [Event.Constructor.Login.LoggingIn()] : [];
        case LoginCommand.Tags.LoginApproved: return state.Login.type == LoginState.Tags.LoggingIn ? [Event.Constructor.Login.LoggedIn()] : [];
        default: Never(cmd);
    }
}
