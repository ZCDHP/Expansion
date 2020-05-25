import { State, Tags as StateTags } from "./projection";
import { Event } from './events'
import { Command, Tags as CommandTags } from './commands';
import { Never } from "../../infrastructure/utils";

export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case CommandTags.Connect: switch (state.type) {
            case StateTags.NotConnected: return [Event.ConnectionRejected({ reason: "Test Rejection" })]// return [Event.Connected()];
            default: return [];
        }
        case CommandTags.Login: switch (state.type) {
            case StateTags.LoggedOut: return [Event.LoginAttempted(cmd.data)];
            default: return [];
        }
        default: Never(cmd);
    }
};
