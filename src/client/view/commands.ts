import * as Union from "../../infrastructure/union";
import { ConstructorMap } from "../../infrastructure/utils";

import { Command as ConnectionCommand } from "./commands.connection";
import { Command as LoginCommand } from "./commands.login";


export namespace Command {
    export const Tags = {
        Connection: "Connection",
        Login: "Login",
    } as const;
    export type Tags = typeof Tags;

    export type Connection = Union.Case<Tags["Connection"], ConnectionCommand>;
    export type Login = Union.Case<Tags["Login"], LoginCommand>;

    export const Constructor = {
        Connection: ConstructorMap<ConnectionCommand, typeof ConnectionCommand.Constructor, Connection>(ConnectionCommand.Constructor, Union.Case(Tags.Connection)()),
        Login: ConstructorMap<LoginCommand, typeof LoginCommand.Constructor, Login>(LoginCommand.Constructor, Union.Case(Tags.Login)()),
    };
}


export type Command =
    | Command.Connection
    | Command.Login

