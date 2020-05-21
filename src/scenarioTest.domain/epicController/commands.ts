import * as Union from "../../infrastructure/union";

import { Epic } from "../script";

export const Tags = {
    Start: "Start",
    PassTime: "PassTime",
} as const;
export type Tags = typeof Tags;

export type Start<TCommand, TEvent> = Union.Case<Tags["Start"], Epic.Script<TCommand, TEvent>>;
export type PassTime = Union.Case<Tags["PassTime"], number>;


export type Commands<TCommand, TEvent> =
    | Start<TCommand, TEvent>
    | PassTime

export const Commands = <TCommand, TEvent>() => ({
    Start: Union.Case(Tags.Start)<Epic.Script<TCommand, TEvent>>(),
    PassTime: Union.Case(Tags.PassTime)<number>(),
});
