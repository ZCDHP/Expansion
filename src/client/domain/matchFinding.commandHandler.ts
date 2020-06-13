import { Never } from "../../infrastructure/utils";

import { State, Command, Event } from "./matchFinding";
import { State as ConnectionState } from "./connection";
import { State as LoginState } from "./login";

export const CommandHandler: (connectionState: ConnectionState) => (loginState: LoginState) => (state: State) => (cmd: Command) => Event[]
    = connectionState => loginState => state => cmd => {
        switch (cmd.type) {
            case Command.Tags.Start:
                if (state.type != State.Tags.None)
                    return [];
                if (connectionState.type != ConnectionState.Tags.Connected)
                    return [Event.Connecting()];
                if (loginState.type != LoginState.Tags.LoggedIn)
                    return [Event.LoggingIn()];
                else
                    return [Event.Queueing()];
            case Command.Tags.Connected: return state.type == State.Tags.Connecting ? [Event.LoggingIn()] : [];
            case Command.Tags.LoggedIn: return state.type == State.Tags.LoggingIn ? [Event.Queueing()] : [];
            case Command.Tags.Queued: return state.type == State.Tags.Queueing ? [Event.Queued()] : [];
            default: Never(cmd);
        }
    }
