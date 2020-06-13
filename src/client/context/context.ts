import { Event, Command } from "../domain/domain";
import * as ConnectionDomain from "./connection";

export namespace State {
    export const Initial: () => State = () => ({
        Connection: ConnectionDomain.State.Initial(),
    });
}

export type State = {
    Connection: ConnectionDomain.State
};

export const Subscription: (issueCommand: (cmd: Command) => void) => (event: Event) => (state: State) => State = issueCommand => event => state => ({
    ...state,
    Connection: ConnectionDomain.Subscription(issueCommand)(event)(state.Connection),
});
