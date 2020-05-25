import ws from 'ws';

import * as Union from "../../infrastructure/union";


export const Tags = {
    Connect: "Connect",
    Login: "Login",
} as const;
export type Tags = typeof Tags;

export type Connect = Union.Case<Tags["Connect"], { connection: ws }>;
export type Login = Union.Case<Tags["Login"], { playerId: number }>;

export type Command =
    | Connect
    | Login

export const Command = {
    Connect: Union.Case(Tags.Connect)<{ connection: ws }>(),
    Login: Union.Case(Tags.Login)<{ playerId: number }>(),
}
