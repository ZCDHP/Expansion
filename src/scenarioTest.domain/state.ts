import * as Event from '../infrastructure/event';

import * as Events from "./events";
import { Story, Epic } from "./script";
import { Never } from "../infrastructure/utils";
import { Conclusion } from "./conclusion";
import * as History from "./history";


type StoryTestingState = {
    id: number,
    elapsedTime: number,
}

export type State<TCommand, TEvent> = {
    stories: Story.Script<TCommand, TEvent>[],
    histories: { [id: number]: History.Record<TCommand, TEvent>[] }
    queued: number[],
    testing: StoryTestingState[],
    completed: { [id: number]: Conclusion<TCommand, TEvent> },
}

const Started: <TCommand, TEvent>(state: State<TCommand, TEvent>, event: Events.Started<TCommand, TEvent>) => State<TCommand, TEvent> =
    (_state, event) => {
        const stories = Epic.Stories(event.data);
        return {
            stories,
            histories: {},
            queued: stories.map((_, index) => index),
            testing: [],
            completed: [],
        };
    };

const TimePassed: <TCommand, TEvent>(state: State<TCommand, TEvent>, event: Events.TimePassed) => State<TCommand, TEvent> =
    (state, event) => ({
        ...state,
        testing: state.testing.map(story => ({ ...story, elapsedTime: story.elapsedTime + event.data, }))
    });

const StoryTestingStarted: <TCommand, TEvent>(state: State<TCommand, TEvent>, event: Events.StoryTestingStarted<TCommand, TEvent>) => State<TCommand, TEvent> =
    (state, event) => ({
        ...state,
        queued: state.queued.filter(x => x != event.data.id),
        testing: [...state.testing, {
            id: event.data.id,
            elapsedTime: 0,
            history: [],
        }],
    });

const StoryConcluded: <TCommand, TEvent>(state: State<TCommand, TEvent>, event: Events.StoryConcluded<TCommand, TEvent>) => State<TCommand, TEvent> =
    (state, event) => ({
        ...state,
        testing: state.testing.filter(x => x.id != event.data.id),
        completed: { ...state.completed, [event.data.id]: event.data.conclusion },
    });

const NextCommandGenerated: <TCommand, TEvent>(state: State<TCommand, TEvent>, event: Events.NextCommandGenerated<TCommand>) => State<TCommand, TEvent> =
    <TCommand, TEvent>(state: State<TCommand, TEvent>, event: Events.NextCommandGenerated<TCommand>) => ({
        ...state,
        histories: {
            [event.data.id]: [...(state.histories[event.data.id] || []), History.Record<TCommand, TEvent>().Command(event.data.command)]
        },
    });

const EventVerified: <TCommand, TEvent>(state: State<TCommand, TEvent>, event: Events.EventVerified<TEvent>) => State<TCommand, TEvent> =
    <TCommand, TEvent>(state: State<TCommand, TEvent>, event: Events.EventVerified<TEvent>) => ({
        ...state,
        histories: {
            [event.data.id]: [...(state.histories[event.data.id] || []), History.Record<TCommand, TEvent>().Event(event.data.event)]
        },
    });


export const Reducer: <TCommand, TEvent>() => Event.Reducer<State<TCommand, TEvent>, Events.Event<TCommand, TEvent>> = <TCommand, TEvent>() => (state: State<TCommand, TEvent>) => (event: Events.Event<TCommand, TEvent>) => {
    switch (event.type) {
        case Events.Tags.Started: return Started(state, event);
        case Events.Tags.TimePassed: return TimePassed(state, event);
        case Events.Tags.StoryTestingStarted: return StoryTestingStarted(state, event);
        case Events.Tags.StoryConcluded: return StoryConcluded(state, event);
        case Events.Tags.NextCommandGenerated: return NextCommandGenerated(state, event);
        case Events.Tags.EventVerified: return EventVerified(state, event);
        case Events.Tags.BackgroundInteractionCompleted: return state;
        case Events.Tags.Completed: return state;
        default: return Never(event);
    }
}

export const Projection: <TCommand, TEvent>() => Event.Projection<State<TCommand, TEvent>, Events.Event<TCommand, TEvent>> = <TCommand, TEvent>() => ({
    initialState: {
        stories: [],
        histories: {},
        queued: [],
        testing: [],
        completed: [],
    },
    reducer: Reducer<TCommand, TEvent>(),
});
