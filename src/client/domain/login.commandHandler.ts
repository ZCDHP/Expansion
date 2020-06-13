import { Never } from "../../infrastructure/utils";

import { State, Command, Event } from "./login";
import { State as ConnectionState } from "./connection";
//import { Event as DomainEvent } from "./domain";

//export const CommandHandler: (state: State) => (cmd: Command) => DomainEvent[] = state => cmd => CommandHandler_Inner(state)(cmd).map(DomainEvent.Login);

export const CommandHandler: (connectionState: ConnectionState) => (state: State) => (cmd: Command) => Event[] = connectionState => state => cmd => {
    switch (cmd.type) {
        case Command.Tags.Start:
            if (state.type != State.Tags.None)
                return [];
            if (connectionState.type == ConnectionState.Tags.None)
                return [Event.Connecting()]
            else
                return [Event.LoggingIn()];
        case Command.Tags.Connected: return state.type == State.Tags.Connecting ? [Event.LoggingIn()] : [];
        case Command.Tags.LoginApproved: return state.type == State.Tags.LoggingIn ? [Event.LoggedIn()] : [];
        default: Never(cmd);
    }
}
