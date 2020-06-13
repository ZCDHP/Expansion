import { Never } from "../../infrastructure/utils";
import * as Union from "../../infrastructure/union";
import * as EventDef from "../../infrastructure/event";

import { Message } from "../../contracts/server.connection";


export namespace Command {
    export const Tags = {
        Connect: "Connect",
        Connected: "Connected",
        Rejected: "Rejected",
    } as const;
    export type Tags = typeof Tags;

    export type Connect = Union.Case<Tags["Connect"], void>;
    export const Connect = Union.Case(Tags.Connect)<void>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type Rejected = Union.Case<Tags["Rejected"], { reason: string }>;
    export const Rejected = Union.Case(Tags.Rejected)<{ reason: string }>();

    export const Constructor = {
        Connect,
        Connected,
        Rejected,
    };

    export const Deserialize: (message: Message) => Command = message => {
        switch (message.type) {
            case Message.Tags.Reject: return Rejected(message.data);
            default: Never(message.type);
        }
    };
}

export type Command =
    | Command.Connect
    | Command.Connected
    | Command.Rejected


export namespace Event {
    export const Tags = {
        Connecting: "Connecting",
        Connected: "Connected",
        Rejected: "Rejected",
    } as const;
    export type Tags = typeof Tags;

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type Rejected = Union.Case<Tags["Rejected"], { reason: string }>;
    export const Rejected = Union.Case(Tags.Rejected)<{ reason: string }>();

    export const Constructor = {
        Connecting,
        Connected,
        Rejected,
    }
}

export type Event =
    | Event.Connecting
    | Event.Connected
    | Event.Rejected


export namespace State {
    export const Tags = {
        None: "None",
        Connecting: "Connecting",
        Connected: "Connected",
        Failed: "Failed",
    } as const;
    export type Tags = typeof Tags;

    export type None = Union.Case<Tags["None"], void>;
    export const None = Union.Case(Tags.None)<void>();

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type Failed = Union.Case<Tags["Failed"], { reason: string }>;
    export const Failed = Union.Case(Tags.Failed)<{ reason: string }>();

    export const Initial: State = None();

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        if (event.type == Event.Tags.Rejected)
            return State.Failed(event.data);

        switch (state.type) {
            case Tags.None: return event.type == Event.Tags.Connecting ? Connecting() : state;
            case Tags.Connecting: return event.type == Event.Tags.Connected ? Connected() : state;
            case Tags.Connected: return state;
            case Tags.Failed: return state;
            default: Never(state);
        }
    }

}

export type State =
    | State.None
    | State.Connecting
    | State.Connected
    | State.Failed
