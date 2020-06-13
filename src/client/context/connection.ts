import { Event, Command } from "../domain/domain";
import { Event as ConnectionEvent } from "../domain/connection";
import { Event as LoginEvent } from "../domain/login";
import { Event as MatchFindingEvent } from "../domain/matchFinding";

import { Message as ClientMessage } from "../../contracts/clientMessage";

export namespace State {
    export const Initial: () => State = () => ({});
}

export type State = {
    connection?: WebSocket
};

export const Subscription: (issueCommand: (cmd: Command) => void) => (event: Event) => (state: State) => State = issueCommand => event => state => {
    switch (event.type) {
        case Event.Tags.Connection: return Subscriptions.Connection(issueCommand)(event.data)(state);
        case Event.Tags.Login: return Subscriptions.Login(issueCommand)(event.data)(state);
        case Event.Tags.MatchFinding: return Subscriptions.MatchFinding(issueCommand)(event.data)(state);
        default: return state;
    }
}

namespace Subscriptions {
    export const Connection: (issueCommand: (cmd: Command) => void) => (event: ConnectionEvent) => (state: State) => State = issueCommand => event => state => {
        switch (event.type) {
            case ConnectionEvent.Tags.Connecting: const protocol = location.protocol === 'https:' ? "wss" : "ws";
                const url = `${protocol}://${location.host}/`;
                const connection = new WebSocket(url);

                connection.onopen = _ => issueCommand(Command.Constructor.Connection.Connected());
                connection.onmessage = e => issueCommand(Command.Deserialize(JSON.parse(e.data as string)));

                return {
                    connection,
                };
            default: return state;
        }
    }

    export const Login: (issueCommand: (cmd: Command) => void) => (event: LoginEvent) => (state: State) => State = _issueCommand => event => state => {
        switch (event.type) {
            case LoginEvent.Tags.LoggingIn:
                state.connection!.send(JSON.stringify(ClientMessage.Constructor.Login.Login()));
                return state;
            default: return state;
        }
    }

    export const MatchFinding: (issueCommand: (cmd: Command) => void) => (event: MatchFindingEvent) => (state: State) => State = _issueCommand => event => state => {
        switch (event.type) {
            case MatchFindingEvent.Tags.Queueing:
                state.connection!.send(JSON.stringify(ClientMessage.Constructor.MatchFinding.FindMatch()));
                return state;
            default: return state;
        }
    }
}
