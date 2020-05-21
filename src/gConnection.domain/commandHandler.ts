import { State, Tags as StateTags } from "./projection.player";
import * as Events from './events'
import { Command, Tags as CommandTags } from './commands';
import { Never } from "../infrastructure/utils";

export const CommandHandler: (state: State) => (cmd: Command) => Events.Event[] = state => cmd => {
    switch (state.type) {
        case StateTags.Connected:
            switch (cmd.type) {
                case CommandTags.Connect: return [Events.Event.Rejected.Player_Already_Connected()];
                case CommandTags.Disconnect: return [Events.Event.Disconnected()];
                default: Never(cmd);
            }
        case StateTags.NotConnected:
            switch (cmd.type) {
                case CommandTags.Connect: return [Events.Event.Connected()];
                case CommandTags.Disconnect: return [];
                default: Never(cmd);
            }
        default: Never(state);
    }
};
