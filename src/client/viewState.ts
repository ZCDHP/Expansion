import * as Connection from "./viewState.connection";

export type State = {
    Connection: Connection.State,
};

export const InitialState: State = {
    Connection: Connection.InitialState,
};
