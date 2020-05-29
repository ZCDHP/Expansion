import { Never } from "../infrastructure/utils";

import { State, Tags as StateTags } from "./viewState.connection";
import { Event } from './events.connection'
import { Command, Tags as CommandTags } from './commands.connection';

export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case CommandTags.Connect: return state.type == StateTags.None ? [Event.Connecting()] : [];
        case CommandTags.Connected: return state.type == StateTags.Connecting ? [Event.Connected()] : [];
        case CommandTags.Disconnect: return [];
        case CommandTags.Rejected: return [Event.Rejected(cmd.data)];
        default: Never(cmd);
    }
};
