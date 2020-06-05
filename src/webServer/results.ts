import * as Union from "../infrastructure/union";
//import { ConstructorMap } from "../infrastructure/utils";

import { Command as ConnectionCommands } from "./connection/commands";
import { Operation as ConnectionOperations } from "./connection/inMemory";

export const Tags = {
    ConnectionCommand: "ConnectionCommand",
    ConnectionOperation: "ConnectionOperation",
} as const;
export type Tags = typeof Tags;


export type ConnectionCommand = Union.Case<Tags["ConnectionCommand"], { sessionId: number, command: ConnectionCommands }>;
export type ConnectionOperation = Union.Case<Tags["ConnectionOperation"], ConnectionOperations>;

export type Result =
    | ConnectionCommand
    | ConnectionOperation

export const Result = {
    ConnectionCommand: Union.Case(Tags.ConnectionCommand)<{ sessionId: number, command: ConnectionCommands }>(),
    ConnectionOperation: Union.Case(Tags.ConnectionOperation)<ConnectionOperations>(),
};
