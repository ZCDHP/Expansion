import * as Union from "../infrastructure/union";


export const Tags = {
    Login: "Login",
    LoginAccepted: "LoginAccepted",
} as const;
export type Tags = typeof Tags;

export type Login = Union.Case<Tags["Login"], { id: number }>;
export type LoginAccepted = Union.Case<Tags["LoginAccepted"], void>;

export type Command =
    | Login
    | LoginAccepted

export const Command = {
    Login: Union.Case(Tags.Login)<{ id: number }>(),
    LoginAccepted: Union.Case(Tags.LoginAccepted)<void>(),
}
