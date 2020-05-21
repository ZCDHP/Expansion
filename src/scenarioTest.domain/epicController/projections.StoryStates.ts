import { __ } from "../../infrastructure/union";
import { Events, Tags as EventTags } from "./events";

import * as Event from '../../infrastructure/event';
import { Story, Epic } from "../script";

export type State<TCommand, TEvent> = {
    stories: Story.Script<TCommand, TEvent>[],
    queued: number[],
    testing: number[],
    completed: number[],
}

export const Reducer: <TCommand, TEvent>() => Event.Reducer<State<TCommand, TEvent>, Events<TCommand, TEvent>> = () => state => event => {
    switch (event.type) {
        case EventTags.Started:
            const stories = Epic.Stories(event.data);
            return {
                stories,
                queued: stories.map((_, index) => index),
                testing: [],
                completed: [],
            };

        default: return state;
    }
}

export const Projection: <TCommand, TEvent>() => Event.Projection<State<TCommand, TEvent>, Events<TCommand, TEvent>> = <TCommand, TEvent>() => ({
    initialState: {
        stories: [],
        queued: [],
        testing: [],
        completed: [],
    },
    reducer: Reducer<TCommand, TEvent>(),
});
