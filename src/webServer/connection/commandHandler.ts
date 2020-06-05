import { State, Tags as StateTags } from "./projection";
import { Event } from './events'
import { Command, Tags as CommandTags } from './commands';
import { Never } from "../../infrastructure/utils";

export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case CommandTags.Connect: switch (state.type) {
            case StateTags.NotConnected: return [Event.Connected()];
            default: return [];
        }
        case CommandTags.Disconnect: return state.type == StateTags.NotConnected ? [] : [Event.Disconnected()];
        case CommandTags.Anything: return [];
        default: Never(cmd);
    }
};
