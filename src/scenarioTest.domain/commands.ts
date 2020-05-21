import * as Union from "../infrastructure/union";

import { Epic } from "./script";

export const Tags = {
    Start: "Start",
    PassTime: "PassTime",
    VerifyTargetEvent: "VerifyTargetEvent",
} as const;
export type Tags = typeof Tags;

export type Start<TCommand, TEvent> = Union.Case<Tags["Start"], Epic.Script<TCommand, TEvent>>;
export type PassTime = Union.Case<Tags["PassTime"], number>;

type VerifyTargetEventData<TEvent> = {
    id: number,
    event: TEvent,
}
export type VerifyTargetEvent<TEvent> = Union.Case<Tags["VerifyTargetEvent"], VerifyTargetEventData<TEvent>>;


export type Command<TCommand, TEvent> =
    | Start<TCommand, TEvent>
    | PassTime
    | VerifyTargetEvent<TEvent>

export const Command = <TCommand, TEvent>() => ({
    Start: Union.Case(Tags.Start)<Epic.Script<TCommand, TEvent>>(),
    PassTime: Union.Case(Tags.PassTime)<number>(),
    VerifyTargetEvent: Union.Case(Tags.VerifyTargetEvent)<VerifyTargetEventData<TEvent>>(),
});
