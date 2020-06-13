import * as Union from "../../infrastructure/union";
import { Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";

import { Message } from "../../contracts/server.login";


export namespace Command {
    export const Tags = {
        Start: "Start",
        Connected: "Connected",
        LoginApproved: "LoginApproved",
    } as const;
    export type Tags = typeof Tags;

    export type Start = Union.Case<Tags["Start"], void>;
    export const Start = Union.Case(Tags.Start)<void>();

    export type Connected = Union.Case<Tags["Connected"], void>;
    export const Connected = Union.Case(Tags.Connected)<void>();

    export type LoginApproved = Union.Case<Tags["LoginApproved"], void>;
    export const LoginApproved = Union.Case(Tags.LoginApproved)<void>();

    export const Constructor = {
        Start,
        Connected,
        LoginApproved,
    };

    export const Deserialize: (message: Message) => Command = message => {
        switch (message.type) {
            case Message.Tags.Approve: return LoginApproved(message.data);
            default: Never(message.type);
        }
    };
}

export type Command =
    | Command.Start
    | Command.Connected
    | Command.LoginApproved


export namespace Event {
    export const Tags = {
        Connecting: "Connecting",
        LoggingIn: "LoggingIn",
        LoggedIn: "LoggedIn",
    } as const;
    export type Tags = typeof Tags;

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type LoggingIn = Union.Case<Tags["LoggingIn"], void>;
    export const LoggingIn = Union.Case(Tags.LoggingIn)<void>();

    export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<void>();

    export const Constructor = {
        Connecting,
        LoggingIn,
        LoggedIn,
    }
}

export type Event =
    | Event.Connecting
    | Event.LoggingIn
    | Event.LoggedIn


export namespace State {
    export const Tags = {
        None: "None",
        Connecting: "Connecting",
        LoggingIn: "LoggingIn",
        LoggedIn: "LoggedIn",
    } as const;
    export type Tags = typeof Tags;

    export type None = Union.Case<Tags["None"], void>;
    export const None = Union.Case(Tags.None)<void>();

    export type Connecting = Union.Case<Tags["Connecting"], void>;
    export const Connecting = Union.Case(Tags.Connecting)<void>();

    export type LoggingIn = Union.Case<Tags["LoggingIn"], void>;
    export const LoggingIn = Union.Case(Tags.LoggingIn)<void>();

    export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<void>();


    export const Initial: State = None();

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        switch (state.type) {
            case Tags.None: switch (event.type) {
                case Event.Tags.Connecting: return Connecting();
                case Event.Tags.LoggingIn: return LoggingIn();
                default: return state;
            }
            case Tags.Connecting: return event.type == Event.Tags.LoggingIn ? LoggingIn() : state;
            case Tags.LoggingIn: return event.type == Event.Tags.LoggedIn ? LoggedIn() : state;;
            case Tags.LoggedIn: return state;
            default: Never(state);
        }
    }
}

export type State =
    | State.None
    | State.Connecting
    | State.LoggingIn
    | State.LoggedIn