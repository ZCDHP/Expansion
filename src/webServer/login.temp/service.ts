import { Event as ConnectionEvent } from "../../contracts/events.connection";
import { Event, Command, CommandHandler } from "./domain";

type Subscription = (e: ConnectionEvent) => void;

export const Service: (eventHandler: (connectionId: number, e: Event) => void) => Subscription = eventHandler => event =>
    (event.type == "MessageReceived" && event.data.message.type == "Login") &&
    CommandHandler(Command.LogIn()).forEach(e => eventHandler(event.data.connectionId, e));

