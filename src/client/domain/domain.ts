import * as Union from "../../infrastructure/union";
import { ConstructorMap, Never } from "../../infrastructure/utils";
import * as EventDef from "../../infrastructure/event";

import * as ConnectionDomain from "./connection";
import * as LoginDomain from "./login";
import * as MatchFindingDomain from "./matchFinding";

import { Message } from "../../contracts/serverMessage";

const Tag = {
    Connection: "Connection",
    Login: "Login",
    MatchFinding: "MatchFinding",
} as const;
type Tag = typeof Tag;


export namespace Command {
    export const Tags = Tag;
    export type Tags = Tag;

    export type Connection = Union.Case<Tags["Connection"], ConnectionDomain.Command>;
    export const Connection = Union.Case(Tags.Connection)<ConnectionDomain.Command>();

    export type Login = Union.Case<Tags["Login"], LoginDomain.Command>;
    export const Login = Union.Case(Tags.Login)<LoginDomain.Command>();

    export type MatchFinding = Union.Case<Tags["MatchFinding"], MatchFindingDomain.Command>;
    export const MatchFinding = Union.Case(Tags.MatchFinding)<MatchFindingDomain.Command>();

    export const Constructor = {
        Connection: ConstructorMap<ConnectionDomain.Command, typeof ConnectionDomain.Command.Constructor, Connection>(ConnectionDomain.Command.Constructor, Connection),
        Login: ConstructorMap<LoginDomain.Command, typeof LoginDomain.Command.Constructor, Login>(LoginDomain.Command.Constructor, Login),
        MatchFinding: ConstructorMap<MatchFindingDomain.Command, typeof MatchFindingDomain.Command.Constructor, MatchFinding>(MatchFindingDomain.Command.Constructor, MatchFinding),
    };

    export const Deserialize: (message: Message) => Command = message => {
        switch (message.type) {
            case Message.Tags.Connection: return Connection(ConnectionDomain.Command.Deserialize(message.data));
            case Message.Tags.Login: return Login(LoginDomain.Command.Deserialize(message.data));
            default: Never(message);
        }
    };
}

export type Command =
    | Command.Connection
    | Command.Login
    | Command.MatchFinding


export namespace Event {
    export const Tags = Tag;
    export type Tags = Tag;

    export type Connection = Union.Case<Tags["Connection"], ConnectionDomain.Event>;
    export const Connection = Union.Case(Tags.Connection)<ConnectionDomain.Event>();

    export type Login = Union.Case<Tags["Login"], LoginDomain.Event>;
    export const Login = Union.Case(Tags.Login)<LoginDomain.Event>();

    export type MatchFinding = Union.Case<Tags["MatchFinding"], MatchFindingDomain.Event>;
    export const MatchFinding = Union.Case(Tags.MatchFinding)<MatchFindingDomain.Event>();

    export const Constructor = {
        Connection: ConstructorMap<ConnectionDomain.Event, typeof ConnectionDomain.Event.Constructor, Connection>(ConnectionDomain.Event.Constructor, Connection),
        Login: ConstructorMap<LoginDomain.Event, typeof LoginDomain.Event.Constructor, Login>(LoginDomain.Event.Constructor, Login),
        MatchFinding: ConstructorMap<MatchFindingDomain.Event, typeof MatchFindingDomain.Event.Constructor, MatchFinding>(MatchFindingDomain.Event.Constructor, MatchFinding),
    }
}

export type Event =
    | Event.Connection
    | Event.Login
    | Event.MatchFinding


export namespace State {
    export const Initial: State = {
        Connection: ConnectionDomain.State.Initial,
        Login: LoginDomain.State.Initial,
        MatchFinding: MatchFindingDomain.State.Initial,
    }

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        switch (event.type) {
            case Event.Tags.Connection: return {
                ...state,
                Connection: ConnectionDomain.State.Reducer(state.Connection)(event.data),
            };
            case Event.Tags.Login: return {
                ...state,
                Login: LoginDomain.State.Reducer(state.Login)(event.data),
            };
            case Event.Tags.MatchFinding: return {
                ...state,
                MatchFinding: MatchFindingDomain.State.Reducer(state.MatchFinding)(event.data),
            };
            default: Never(event);
        }
    };
}

export type State = {
    Connection: ConnectionDomain.State,
    Login: LoginDomain.State,
    MatchFinding: MatchFindingDomain.State,
};
