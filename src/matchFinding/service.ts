import { Reduce } from "../infrastructure/event";

import { Event, Command, State, CommandHandler } from "./domain";

type EventHandler = (e: Event) => void;
type Subscription = (cmd: Command) => void;

export const Service: (eventHandler: EventHandler) => Subscription = eventHandler => {
    let state = State.Initial();
    return event => {
        const events = CommandHandler(event)(state);
        state = Reduce(State.Reducer)(state)(events);
        events.forEach(eventHandler);
    };
};

