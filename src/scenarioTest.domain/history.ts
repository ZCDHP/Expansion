import * as Union from "../infrastructure/union";

export const Tags = {
    Command: "Command",
    Event: "Event",
} as const;
export type Tags = typeof Tags;

export type Command<TCommand> = Union.Case<Tags["Command"], TCommand>;
export type Event<TEvent> = Union.Case<Tags["Event"], TEvent>;

export type Record<TCommand, TEvent> =
    | Command<TCommand>
    | Event<TEvent>

export const Record = <TCommand, TEvent>() => ({
    Command: Union.Case(Tags.Command)<TCommand>(),
    Event: Union.Case(Tags.Event)<TEvent>(),
});