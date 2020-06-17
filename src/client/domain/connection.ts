import { Never } from "../../infrastructure/utils";
import * as Union from "../../infrastructure/union";
import * as EventDef from "../../infrastructure/event";

import { Message as ConnectionMessage } from "../../contracts/server.connection";
import { Message as LoginMessage } from "../../contracts/server.login";

import * as LoginDomain from "./login";

export namespace Command {
    export const Tags = {
        Connect: "Connect",
        Connected: "Connected",
        Rejected: "Rejected",
        LoginCommand: "LoginCommand",
    } as const;
    export type Tags = typeof Tags;

    export type Connect = Union.Case<Tags["Connect"], void>;
    export const Connect = Union.Case(Tags.Connect)<void>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type Rejected = Union.Case<Tags["Rejected"], { reason: string }>;
    export const Rejected = Union.Case(Tags.Rejected)<{ reason: string }>();

    export type LoginCommand = Union.Case<Tags["LoginCommand"], LoginDomain.Command>;
    export const LoginCommand = Union.Case(Tags.LoginCommand)<LoginDomain.Command>();

    export const Deserialize: (message: ConnectionMessage) => Command = message => {
        switch (message.type) {
            case ConnectionMessage.Tags.Reject: return Rejected(message.data);
            default: Never(message.type);
        }
    };

    export const DeserializeLoginMessage: (message: LoginMessage) => Command = message => LoginCommand(LoginDomain.Command.Deserialize(message));
}
export type Command =
    | Command.Connect
    | Command.Connected
    | Command.Rejected
    | Command.LoginCommand


export namespace Event {
    export const Tags = {
        Connecting: "Connecting",
        CommandQueued: "CommandQueued",
        CommandDequeued: "CommandDequeued",
        Connected: "Connected",
        Rejected: "Rejected",

        LoginEvent: "LoginEvent",
    } as const;
    export type Tags = typeof Tags;

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type CommandQueued = Union.Case<Tags["CommandQueued"], LoginDomain.Command>;
    export const CommandQueued = Union.Case(Tags.CommandQueued)<LoginDomain.Command>();

    export type CommandDequeued = Union.Case<Tags["CommandDequeued"], LoginDomain.Command>;
    export const CommandDequeued = Union.Case(Tags.CommandDequeued)<LoginDomain.Command>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type Rejected = Union.Case<Tags["Rejected"], { reason: string }>;
    export const Rejected = Union.Case(Tags.Rejected)<{ reason: string }>();

    export type LoginEvent = Union.Case<Tags["LoginEvent"], LoginDomain.Event>;
    export const LoginEvent = Union.Case(Tags.LoginEvent)<LoginDomain.Event>();

    export const ExtractCommand: (events: Event) => Command | null = event => {
        switch (event.type) {
            case Tags.CommandDequeued: return Command.LoginCommand(event.data);
            case Tags.LoginEvent:
                const inner = LoginDomain.Event.ExtractCommand(event.data);
                return inner ? Command.LoginCommand(inner) : null;
            default: return null;
        }
    }
}
export type Event =
    | Event.Connecting
    | Event.CommandQueued
    | Event.CommandDequeued
    | Event.Connected
    | Event.Rejected
    | Event.LoginEvent


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

    export type Connecting = Union.Case<Tags["Connecting"], LoginDomain.Command[]>;
    export const Connecting = Union.Case(Tags.Connecting)<LoginDomain.Command[]>();

    type ConnectedData = {
        Login: LoginDomain.State,
    };
    export type Connected = Union.Case<Tags["Connected"], ConnectedData>;
    export const Connected = Union.Case(Tags.Connected)<ConnectedData>();

    export type Failed = Union.Case<Tags["Failed"], { reason: string }>;
    export const Failed = Union.Case(Tags.Failed)<{ reason: string }>();

    export const Initial: State = None();

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        if (event.type == Event.Tags.Rejected)
            return State.Failed(event.data);

        switch (state.type) {
            case Tags.None: return event.type == Event.Tags.Connecting ? Connecting([]) : state;
            case Tags.Connecting: switch (event.type) {
                case Event.Tags.Connected: return Connected({ Login: LoginDomain.State.Initial });
                case Event.Tags.CommandQueued: return Connecting([...state.data, event.data]);
                default: return state;
            };
            case Tags.Connected:
                return event.type == Event.Tags.LoginEvent ?
                    Connected({ Login: LoginDomain.State.Reducer(state.data.Login)(event.data) }) :
                    state;
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

export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case Command.Tags.Connect:
            return state.type == State.Tags.None ? [Event.Connecting()] : [];
        case Command.Tags.Connected:
            return state.type == State.Tags.Connecting ? [Event.Connected(), ...state.data.map(Event.CommandDequeued)] : [];
        case Command.Tags.Rejected: return [Event.Rejected(cmd.data)];
        case Command.Tags.LoginCommand: switch (state.type) {
            case State.Tags.None: return [Event.Connecting(), Event.CommandQueued(cmd.data)];
            case State.Tags.Connecting: return [Event.CommandQueued(cmd.data)];
            case State.Tags.Connected: return LoginDomain.CommandHandler(state.data.Login)(cmd.data).map(Event.LoginEvent);
            default: return [];
        };
        default: Never(cmd);
    }
}

