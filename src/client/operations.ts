import { Event, Tags as EventTags } from "./events";
import { Command } from "./commands";
import { State } from "./context";
import { PushEvent as Connection } from "./operations.connection";

export const PushEvent: (event: Event) => (onCommand: (command: Command) => void) => (stats: State) => State = event => {
    switch (event.type) {
        case EventTags.Connection: return onCommand => state => ({
            ...state,
            Connection: Connection(event.data)(onCommand)(state.Connection)
        });
        default: return _ => state => state;
    }
};

