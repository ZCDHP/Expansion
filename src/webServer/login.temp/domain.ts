import * as Union from "../../infrastructure/union";

export namespace Event {
    export const Tags = {
        LoggedIn: "LoggedIn",
    } as const;
    export type Tags = typeof Tags;


    export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<void>();

}

export type Event =
    | Event.LoggedIn


export namespace Command {
    export const Tags = {
        LogIn: "LogIn",
    } as const;
    export type Tags = typeof Tags;


    export type LogIn = Union.Case<Tags["LogIn"], void>;
    export const LogIn = Union.Case(Tags.LogIn)<void>();
}

export type Command =
    | Command.LogIn

export const CommandHandler: (c: Command) => Event[] = _ => [Event.LoggedIn()];
