import { State } from "./state";
import * as Events from './events'
import { Command } from './commands';

import { CommandHandler as LoginHandler } from "./commandHandler.login";


export const CommandHandler: (state: State) => (cmd: Command) => Events.Event[] = state => cmd => [
    ...LoginHandler(state.login)(cmd),
];