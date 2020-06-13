import { Never } from "../../infrastructure/utils";

import { State, Command, Event } from "./domain";

import { CommandHandler as Connection } from "./connection.commandHandler";
import { CommandHandler as Login } from "./login.commandHandler";
import { CommandHandler as MatchFinding } from "./matchFinding.commandHandler";

export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case Command.Tags.Connection: return Connection(state.Connection)(cmd.data).map(Event.Connection);
        case Command.Tags.Login: return Login(state.Connection)(state.Login)(cmd.data).map(Event.Login);
        case Command.Tags.MatchFinding: return MatchFinding(state.Connection)(state.Login)(state.MatchFinding)(cmd.data).map(Event.MatchFinding);
        default: Never(cmd);
    }
}
