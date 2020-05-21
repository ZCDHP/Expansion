import * as Union from "../../infrastructure/union";

import { Epic } from "../script";

export const Tags = {
    Started: "Started",
    TimePassed: "TimePassed",
} as const;
export type Tags = typeof Tags;

export type Started<TCommand, TEvent> = Union.Case<Tags["Started"], Epic.Script<TCommand, TEvent>>;
export type TimePassed = Union.Case<Tags["TimePassed"], number>;


export type Events<TCommand, TEvent> =
    | Started<TCommand, TEvent>
    | TimePassed

export const Events = <TCommand, TEvent>() => ({
    Started: Union.Case(Tags.Started)<Epic.Script<TCommand, TEvent>>(),
    TimePassed: Union.Case(Tags.TimePassed)<number>(),
});


