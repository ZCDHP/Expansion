import { Event, Tags as EventTags } from "../view/events.login";
import { Command } from "../view/commands";

type State = never;

export const PushEvent: (event: Event) => (onCommand: (command: Command) => void) => (stats: State) => State = event => {
    switch (event.type) {
        case EventTags.CheckingLocalPlayerInfo: return RestoreLocalPlayerInfo();
        default: return _ => state => state;
    }
};

const RestoreLocalPlayerInfo: () => (onCommand: (command: Command) => void) => (stats: State) => State = () => onCommand => state => {
    const playerId = localStorage.getItem("playerId");

    onCommand(Command.Login.RestoredLocalPlayerInfo(playerId ? { playerId: Number(playerId) } : null));

    return state;
};
