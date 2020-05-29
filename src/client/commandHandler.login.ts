import { Never } from "../infrastructure/utils";

import { State, Tags as StateTags } from "./viewState.login";
import { Event } from './events.login'
import { Command, Tags as CommandTags } from './commands.login';

export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case CommandTags.Start: return state.type == StateTags.None ? [Event.Connecting()] : [];
        case CommandTags.Connected: return state.type == StateTags.Connecting ? [Event.CheckingLocalPlayerInfo()] : [];
        case CommandTags.RestoredLocalPlayerInfo: return [];
        default: Never(cmd);
    }
};
