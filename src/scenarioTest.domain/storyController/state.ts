import * as Union from "../../infrastructure/union";
import * as Event from '../../infrastructure/event';


import { Story } from "../script";
import { Value as Events, Tags as EventTags } from "./events";
import { Conclusion } from "./conclusion";
import { Never } from "../../infrastructure/utils";

export const Tags = {
    Uninitialized: "Uninitialized",
    Testing: "Testing",
    Concluded: "Concluded",
} as const;
export type Tags = typeof Tags;

export type Uninitialized = Union.Case<Tags["Uninitialized"], void>

type TestingState<TCommand, TEvent> = {
    script: Story.Script<TCommand, TEvent>,
    elapsedTime: number,
};
export type Testing<TCommand, TEvent> = Union.Case<Tags["Testing"], TestingState<TCommand, TEvent>>

export type Concluded = Union.Case<Tags["Concluded"], Conclusion>
const Concluded = Union.Case(Tags["Concluded"]);

export type Value<TCommand, TEvent> =
    | Uninitialized
    | Testing<TCommand, TEvent>
    | Concluded

export const Value = <TCommand, TEvent>() => ({
    Uninitialized: Union.Case(Tags["Uninitialized"])<void>(),
    Testing: Union.Case(Tags["Testing"])<TestingState<TCommand, TEvent>>(),
    Concluded: Union.Case(Tags["Concluded"])<Conclusion>(),
});

export const Reducer: <TCommand, TEvent>() => Event.Reducer<Value<TCommand, TEvent>, Events<TCommand, TEvent>> =
    <TCommand, TEvent>() => (state: Value<TCommand, TEvent>) => (event: Events<TCommand, TEvent>) => {
        switch (state.type) {
            case Tags.Uninitialized: switch (event.type) {
                case EventTags.Initialized: return Value<TCommand, TEvent>().Testing({
                    script: event.data,
                    elapsedTime: 0
                });
                default: return state;
            }
            case Tags.Testing: switch (event.type) {
                case EventTags.TimePassed: return Value<TCommand, TEvent>().Testing({
                    ...state.data,
                    elapsedTime: state.data.elapsedTime + event.data
                });
                case EventTags.Concluded: return Value<TCommand, TEvent>().Concluded(event.data);
                default: return state;
            }
            case Tags.Concluded: return state;
            default: return Never(state);
        }
    };

export const Projection: <TCommand, TEvent>() => Event.Projection<Value<TCommand, TEvent>, Events<TCommand, TEvent>> = <TCommand, TEvent>() => ({
    initialState: Value<TCommand, TEvent>().Uninitialized(),
    reducer: Reducer<TCommand, TEvent>(),
});
