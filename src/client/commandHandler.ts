import { Never } from "../infrastructure/utils";

import { Event } from "./events";
import { Command, Tags as CommandTags } from "./commands";
import { State } from "./viewState";

import { CommandHandler as ConnectionHandler } from "./commandHandler.connection";

export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case CommandTags.Connection: return ConnectionHandler(state.Connection)(cmd.data).map(Event.Connection);
        case CommandTags.Login: return [];
        default: Never(cmd);
    }
}
