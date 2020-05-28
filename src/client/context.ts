import * as Connection from "./context.connection";

export type State = {
    Connection: Connection.State,
};

export const InitialState: State = {
    Connection: Connection.InitialState,
};

