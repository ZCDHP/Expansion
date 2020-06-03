import * as Connection from "./state.connection";

export type State = {
    Connection: Connection.State,
};

export const InitialState: State = {
    Connection: Connection.InitialState,
};

