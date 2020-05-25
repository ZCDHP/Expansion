import { State, Tags as StateTags } from "./state.login";
import * as Events from './events'
import { Command, Tags as CommandTags } from './commands';

export const CommandHandler: (state: State) => (cmd: Command) => Events.Event[] = state => cmd => {
    switch (cmd.type) {
        case CommandTags.Login: switch (state.type) {
            case StateTags.LoggedOut: return [Events.Event.LoginAttempted(cmd.data)];
            default: return [];
        }
        case CommandTags.LoginAccepted: switch (state.type) {
            case StateTags.LoggingIn: return [Events.Event.LoggedIn()];
            default: return [];
        }
        default: return [];
    }
};
