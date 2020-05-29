import * as Union from "../infrastructure/union";
import { Command as ConnectionCommand } from "./commands.connection";

import { ConstructorMap } from "../infrastructure/utils";


export const Tags = {
    Connection: "Connection",
    Login: "Login",
} as const;
export type Tags = typeof Tags;

export type Connection = Union.Case<Tags["Connection"], ConnectionCommand>;
export type Login = Union.Case<Tags["Login"], void>;

export type Command =
    | Connection
    | Login

export const Command = {
    Connection: ConstructorMap<ConnectionCommand, typeof ConnectionCommand, Connection>(ConnectionCommand, Union.Case(Tags.Connection)()),
};
