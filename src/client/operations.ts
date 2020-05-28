import * as Union from "../infrastructure/union";
import { ConstructorMap, Never } from "../infrastructure/utils";

import { State } from "./appState";
import * as ConnectionOperations from "./operations.connection";

export const Tags = {
    Connection: "Connection",
    Login: "Login",
} as const;
export type Tags = typeof Tags;

export type Connection = Union.Case<Tags["Connection"], ConnectionOperations.Operation>;
export type Login = Union.Case<Tags["Login"], void>;

export type Operation =
    | Connection
    | Login

export const Operation = {
    Connection: ConstructorMap<ConnectionOperations.Operation, typeof ConnectionOperations.Operation, Connection>(ConnectionOperations.Operation, Union.Case(Tags.Connection)()),
};

export const Apply: (operation: Operation) => (onOperation: (operation: Operation) => void) => (stats: State) => State = operation => {
    switch (operation.type) {
        case Tags.Connection: return ConnectionOperations.Apply(operation.data);
        case Tags.Login: throw new Error("No Implementation");
        default: Never(operation);
    }
}
