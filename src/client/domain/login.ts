import * as Union from "../../infrastructure/union";
import { Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";

import { Message } from "../../contracts/server.login";

import * as MatchFindingDomain from "./matchFinding";

export namespace Command {
    export const Tags = {
        Login: "Login",
        LoginApproved: "LoginApproved",
        MatchFindingCommand: "MatchFindingCommand",
    } as const;
    export type Tags = typeof Tags;

    export type Login = Union.Case<Tags["Login"], void>;
    export const Login = Union.Case(Tags.Login)<void>();

    export type LoginApproved = Union.Case<Tags["LoginApproved"], void>;
    export const LoginApproved = Union.Case(Tags.LoginApproved)<void>();

    export type MatchFindingCommand = Union.Case<Tags["MatchFindingCommand"], MatchFindingDomain.Command>;
    export const MatchFindingCommand = Union.Case(Tags.MatchFindingCommand)<MatchFindingDomain.Command>();

    export const Deserialize: (message: Message) => Command = message => {
        switch (message.type) {
            case Message.Tags.Approve: return LoginApproved(message.data);
            default: Never(message.type);
        }
    };
}

export type Command =
    | Command.Login
    | Command.LoginApproved
    | Command.MatchFindingCommand


export namespace Event {
    export const Tags = {
        LoggingIn: "LoggingIn",
        CommandQueued: "CommandQueued",
        CommandDequeued: "CommandDequeued",
        LoggedIn: "LoggedIn",
        MatchFindingEvent: "MatchFindingEvent",
    } as const;
    export type Tags = typeof Tags;

    export type LoggingIn = Union.Case<Tags["LoggingIn"], void>;
    export const LoggingIn = Union.Case(Tags.LoggingIn)<void>();

    export type CommandQueued = Union.Case<Tags["CommandQueued"], MatchFindingDomain.Command>;
    export const CommandQueued = Union.Case(Tags.CommandQueued)<MatchFindingDomain.Command>();

    export type CommandDequeued = Union.Case<Tags["CommandDequeued"], MatchFindingDomain.Command>;
    export const CommandDequeued = Union.Case(Tags.CommandDequeued)<MatchFindingDomain.Command>();

    export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<void>();

    export type MatchFindingEvent = Union.Case<Tags["MatchFindingEvent"], MatchFindingDomain.Event>;
    export const MatchFindingEvent = Union.Case(Tags.MatchFindingEvent)<MatchFindingDomain.Event>();


    export const ExtractCommand: (events: Event) => Command | null = event => {
        switch (event.type) {
            case Tags.CommandDequeued: return Command.MatchFindingCommand(event.data);
            default: return null;
        }
    }
}

export type Event =
    | Event.LoggingIn
    | Event.CommandQueued
    | Event.CommandDequeued
    | Event.LoggedIn
    | Event.MatchFindingEvent


export namespace State {
    export const Tags = {
        None: "None",
        LoggingIn: "LoggingIn",
        LoggedIn: "LoggedIn",
    } as const;
    export type Tags = typeof Tags;

    export type None = Union.Case<Tags["None"], void>;
    export const None = Union.Case(Tags.None)<void>();


    export type LoggingIn = Union.Case<Tags["LoggingIn"], MatchFindingDomain.Command[]>;
    export const LoggingIn = Union.Case(Tags.LoggingIn)<MatchFindingDomain.Command[]>();

    type LoggedState = { MatchFinding: MatchFindingDomain.State };
    export type LoggedIn = Union.Case<Tags["LoggedIn"], LoggedState>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<LoggedState>();


    export const Initial: State = None();

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        switch (state.type) {
            case Tags.None: return event.type == Event.Tags.LoggingIn ? LoggingIn([]) : state;
            case Tags.LoggingIn: switch (event.type) {
                case Event.Tags.LoggedIn: return LoggedIn({ MatchFinding: MatchFindingDomain.State.Initial });
                case Event.Tags.CommandQueued: return LoggingIn([...state.data, event.data]);
                default: return state;
            }
            case Tags.LoggedIn:
                return event.type == Event.Tags.MatchFindingEvent ?
                    LoggedIn({ MatchFinding: MatchFindingDomain.State.Reducer(state.data.MatchFinding)(event.data) }) :
                    state;
            default: Never(state);
        }
    };
}

export type State =
    | State.None
    | State.LoggingIn
    | State.LoggedIn


export const CommandHandler: (state: State) => (cmd: Command) => Event[] = state => cmd => {
    switch (cmd.type) {
        case Command.Tags.Login: return state.type == State.Tags.None ? [Event.LoggingIn()] : [];
        case Command.Tags.LoginApproved: return state.type == State.Tags.LoggingIn ? [Event.LoggedIn(), ...state.data.map(Event.CommandDequeued)] : [];
        case Command.Tags.MatchFindingCommand: switch (state.type) {
            case State.Tags.None:
                return [Event.LoggingIn(), Event.CommandQueued(cmd.data)];
            case State.Tags.LoggingIn:
                return [Event.CommandQueued(cmd.data)];
            case State.Tags.LoggedIn:
                return MatchFindingDomain.CommandHandler(state.data.MatchFinding)(cmd.data).map(Event.MatchFindingEvent);
            default: return [];
        }
        default: Never(cmd);
    }
};
