import { Event } from "./events";
import { Command } from "./commands";
import { State } from "./state";

import { CommandHandler as ConnectionHandler } from "./commandHandler.connection";
import { CommandHandler as LoginHandler } from "./commandHandler.login";

export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    return [
        ...ConnectionHandler(state)(cmd),
        ...LoginHandler(state)(cmd),
    ];
}
