import * as Union from "../../infrastructure/union";
import { Conclusion, Pass, Fail } from "./conclusion";
import { Story } from "../script";

export const Tags = {
    Initialized: "Initialized",
    TimePassed: "TimePassed",
    Concluded: "Concluded",
} as const;
export type Tags = typeof Tags;


export type Initialized<TCommand, TEvent> = Union.Case<Tags["Initialized"], Story.Script<TCommand, TEvent>>;
export type TimePassed = Union.Case<Tags["TimePassed"], number>;
export type Concluded = Union.Case<Tags["Concluded"], Conclusion>;


export type Value<TCommand, TEvent> =
    | Initialized<TCommand, TEvent>
    | TimePassed
    | Concluded

export const Value = <TCommand, TEvent>() => ({
    Initialized: Union.Case(Tags.Initialized)<Story.Script<TCommand, TEvent>>(),
    TimePassed: Union.Case(Tags.TimePassed)<number>(),
    Concluded: {
        To: Union.Case(Tags.Concluded)<Conclusion>(),
        Pass: () => Union.Case(Tags.Concluded)<Conclusion>()(Pass()),
        Fail: (reason: any) => Union.Case(Tags.Concluded)<Conclusion>()(Fail(reason)),
    },
});
