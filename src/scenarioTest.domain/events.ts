import * as Union from "../infrastructure/union";

import { Epic, Story } from "./script";
import { Conclusion, Pass, Fail, Reason } from "./conclusion";

export const Tags = {
    Started: "Started",
    TimePassed: "TimePassed",
    StoryTestingStarted: "StoryTestingStarted",
    NextCommandGenerated: "NextCommandGenerated",
    EventVerified: "EventVerified",
    BackgroundInteractionCompleted: "BackgroundInteractionCompleted",
    StoryConcluded: "StoryConcluded",
    Completed: "Completed"
} as const;
export type Tags = typeof Tags;

export type Started<TCommand, TEvent> = Union.Case<Tags["Started"], Epic.Script<TCommand, TEvent>>;

type StoryTestingStartedData<TCommand, TEvent> = {
    script: Story.Script<TCommand, TEvent>,
    id: number,
}
export type StoryTestingStarted<TCommand, TEvent> = Union.Case<Tags["StoryTestingStarted"], StoryTestingStartedData<TCommand, TEvent>>;

type NextCommandGeneratedData<TCommand> = {
    command: TCommand,
    id: number,
}
export type NextCommandGenerated<TCommand> = Union.Case<Tags["NextCommandGenerated"], NextCommandGeneratedData<TCommand>>;

type EventVerifiedData<TEvent> = {
    event: TEvent,
    id: number,
}
export type EventVerified<TEvent> = Union.Case<Tags["EventVerified"], EventVerifiedData<TEvent>>;

type BackgroundInteractionCompletedData<TCommand, TEvent> = {
    interaction: Story.Interaction<TCommand, TEvent>,
    id: number,
}
export type BackgroundInteractionCompleted<TCommand, TEvent> = Union.Case<Tags["BackgroundInteractionCompleted"], BackgroundInteractionCompletedData<TCommand, TEvent>>;

type StoryConcludedData<TCommand, TEvent> = {
    conclusion: Conclusion<TCommand, TEvent>,
    id: number,
}
export type StoryConcluded<TCommand, TEvent> = Union.Case<Tags["StoryConcluded"], StoryConcludedData<TCommand, TEvent>>;

export type TimePassed = Union.Case<Tags["TimePassed"], number>;

export type Completed = Union.Case<Tags["Completed"], void>;


export type Event<TCommand, TEvent> =
    | Started<TCommand, TEvent>
    | TimePassed
    | StoryTestingStarted<TCommand, TEvent>
    | NextCommandGenerated<TCommand>
    | EventVerified<TEvent>
    | BackgroundInteractionCompleted<TCommand, TEvent>
    | StoryConcluded<TCommand, TEvent>
    | Completed

export const Event = <TCommand, TEvent>() => ({
    Started: Union.Case(Tags.Started)<Epic.Script<TCommand, TEvent>>(),
    TimePassed: Union.Case(Tags.TimePassed)<number>(),
    StoryTestingStarted: Union.Case(Tags.StoryTestingStarted)<StoryTestingStartedData<TCommand, TEvent>>(),
    NextCommandGenerated: Union.Case(Tags.NextCommandGenerated)<NextCommandGeneratedData<TCommand>>(),
    EventVerified: Union.Case(Tags.EventVerified)<EventVerifiedData<TEvent>>(),
    BackgroundInteractionCompleted: Union.Case(Tags.BackgroundInteractionCompleted)<BackgroundInteractionCompletedData<TCommand, TEvent>>(),
    StoryConcluded: (id: number) => ({
        To: Union.Case(Tags.StoryConcluded)<StoryConcludedData<TCommand, TEvent>>(),
        Pass: () => Union.Case(Tags.StoryConcluded)<StoryConcludedData<TCommand, TEvent>>()({
            id,
            conclusion: Pass(),
        }),
        Fail: (reason: Reason.Value<TCommand, TEvent>) => Union.Case(Tags.StoryConcluded)<StoryConcludedData<TCommand, TEvent>>()({
            id,
            conclusion: Fail(reason),
        }),
    }),
    Completed: Union.Case(Tags.Completed)<void>(),
});


