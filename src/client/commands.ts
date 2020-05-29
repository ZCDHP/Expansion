import * as Union from "../infrastructure/union";
import { ConstructorMap } from "../infrastructure/utils";

import { Command as ConnectionCommand } from "./commands.connection";
import { Command as LoginCommand } from "./commands.login";



export const Tags = {
    Connection: "Connection",
    Login: "Login",
} as const;
export type Tags = typeof Tags;

export type Connection = Union.Case<Tags["Connection"], ConnectionCommand>;
export type Login = Union.Case<Tags["Login"], LoginCommand>;

export type Command =
    | Connection
    | Login

export const Command = {
    Connection: ConstructorMap<ConnectionCommand, typeof ConnectionCommand, Connection>(ConnectionCommand, Union.Case(Tags.Connection)()),
    Login: ConstructorMap<LoginCommand, typeof LoginCommand, Login>(LoginCommand, Union.Case(Tags.Login)()),
};
