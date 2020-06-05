import * as Union from "../infrastructure/union";

export const Tags = {
    Login: "Login",
    Anything: "Anything",
} as const;
export type Tags = typeof Tags;


export type Login = Union.Case<Tags["Login"], void>;
export type Anything = Union.Case<Tags["Anything"], any>;

export type Message =
    | Login
    | Anything

export const Message = {
    Login: Union.Case(Tags.Login)<void>(),
    Anything: Union.Case(Tags.Anything)<any>(),
};
