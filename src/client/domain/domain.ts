import * as Union from "../../infrastructure/union";
import { Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";

import * as ConnectionDomain from "./connection";


const Tag = {
    Connection: "Connection",
} as const;
type Tag = typeof Tag;


export namespace Command {
    export const Tags = Tag;
    export type Tags = typeof Tags;

    export type Connection = Union.Case<Tags["Connection"], ConnectionDomain.Command>;
    export const Connection = Union.Case(Tags.Connection)<ConnectionDomain.Command>();
}

export type Command =
    | Command.Connection


export namespace Event {
    export const Tags = {
        ...Tag,
    } as const;
    export type Tags = typeof Tags;

    export type Connection = Union.Case<Tags["Connection"], ConnectionDomain.Event>;
    export const Connection = Union.Case(Tags.Connection)<ConnectionDomain.Event>();

    export const ExtractCommand: (event: Event) => Command | null = event => {
        switch (event.type) {
            case Tags.Connection:
                const inner = ConnectionDomain.Event.ExtractCommand(event.data)
                return inner ? Command.Connection(inner) : null;
            default: return Never(event.type);
        }
    };

    export const ExtractCommands: (events: Event[]) => Command[] = events => events.reduce<Command[]>((result, event) => {
        const cmd = ExtractCommand(event);
        return cmd ? [...result, cmd] : result;
    }, []);
}

export type Event =
    | Event.Connection

export namespace State {
    export const Initial: State = {
        Connection: ConnectionDomain.State.Initial,
    }

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        switch (event.type) {
            case Event.Tags.Connection: return {
                ...state,
                Connection: ConnectionDomain.State.Reducer(state.Connection)(event.data),
            };
            default: Never(event.type);
        }
    };
}
export type State = {
    Connection: ConnectionDomain.State,
};


export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case Command.Tags.Connection: return ConnectionDomain.CommandHandler(state.Connection)(cmd.data).map(Event.Connection);
        default: Never(cmd.type);
    }
}
