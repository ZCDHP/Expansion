import { Never } from "../../infrastructure/utils";

import { State, Command, Event } from "./connection";

export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case Command.Tags.Connect:
            return state.type == State.Tags.None ? [Event.Connecting()] : [];
        case Command.Tags.Connected:
            return state.type == State.Tags.Connecting ? [Event.Connected()] : [];
        case Command.Tags.Rejected: return [Event.Rejected(cmd.data)];
        default: Never(cmd);
    }
}
