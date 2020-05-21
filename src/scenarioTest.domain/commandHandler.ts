import { Never } from '../infrastructure/utils';

import { FindExceptedEventPosition } from './InteractionCursor';
import { Event as Events } from './events';
import { Commands as Commands, Tags as CommandTags } from './commands';
import { State } from './state';
import * as History from "./history";
import { Reason } from './conclusion';


export const CommandHandler: <TCommand, TEvent>() => (state: State<TCommand, TEvent>) => (cmd: Commands<TCommand, TEvent>) => Events<TCommand, TEvent>[] =
    <TCommand, TEvent>() => (state: State<TCommand, TEvent>) => (cmd: Commands<TCommand, TEvent>) => {
        switch (cmd.type) {
            case CommandTags.Start: return [Events<TCommand, TEvent>().Started(cmd.data)];
            case CommandTags.PassTime: return [
                Events<TCommand, TEvent>().TimePassed(cmd.data),
                ...StoryTestingStartEvents(state),
                ...StoryTestingTimeoutEvents(state, cmd.data),
                ...((state.queued.length == 0 && state.testing.length == 0) ?
                    [Events<TCommand, TEvent>().Completed()] : [])
            ];
            case CommandTags.VerifyTargetEvent: {
                const storyScript = state.stories[cmd.data.id];
                const storyState = state.testing.find(s => s.id == cmd.data.id);
                const storyHistory = state.histories[cmd.data.id] || [];
                const allInteractions = [...storyScript.background, storyScript.expectedInteraction];
                if (storyState == null)
                    throw Error(); // TODO

                const currentPosition = FindExceptedEventPosition(allInteractions, { interactionIndex: 0, eventIndex: 0 }, storyHistory.filter(x => x.type == History.Tags.Event).length);
                if (currentPosition == "No Expectation")
                    return [Events<TCommand, TEvent>().StoryConcluded(cmd.data.id).Fail(Reason.Value<TCommand, TEvent>().UnexpectedEvent({
                        message: "Unexpected event.",
                        history: storyHistory,
                        expected: null,
                        actual: cmd.data.event,
                    }))];

                const isBuildingBackground = currentPosition.interactionIndex < storyScript.background.length;
                const expectedInteraction = allInteractions[currentPosition.interactionIndex];
                const expectedEvent = expectedInteraction.consequences[currentPosition.eventIndex];
                const isEventValid = JSON.stringify(expectedEvent) == JSON.stringify(cmd.data.event);
                const isLastEventInInteraction = expectedInteraction.consequences.length == currentPosition.eventIndex + 1;

                const validationEvents = isEventValid ?
                    [Events<TCommand, TEvent>().EventVerified(cmd.data)] :
                    (isBuildingBackground ?
                        [Events<TCommand, TEvent>().StoryConcluded(cmd.data.id).Fail(Reason.Value<TCommand, TEvent>().UnexpectedEvent({
                            message: "Unexpected event in background building.",
                            history: storyHistory,
                            expected: expectedEvent,
                            actual: cmd.data.event,
                        }))] :
                        [Events<TCommand, TEvent>().StoryConcluded(cmd.data.id).Fail(Reason.Value<TCommand, TEvent>().UnexpectedEvent({
                            message: "Unexpected event.",
                            history: storyHistory,
                            expected: expectedEvent,
                            actual: cmd.data.event,
                        }))]);

                const backgroundBuildingEvents = isBuildingBackground && isEventValid && isLastEventInInteraction ?
                    [Events<TCommand, TEvent>().BackgroundInteractionCompleted({
                        id: cmd.data.id,
                        interaction: allInteractions[currentPosition.interactionIndex],
                    })] :
                    [];

                const passingEvents = !isBuildingBackground && isEventValid && isLastEventInInteraction ?
                    [Events<TCommand, TEvent>().StoryConcluded(cmd.data.id).Pass()] :
                    [];

                return [
                    ...validationEvents,
                    ...backgroundBuildingEvents,
                    ...passingEvents,
                ];
            }
            default: return Never(cmd)
        }
    }

const StoryTestingStartEvents = <TCommand, TEvent>(state: State<TCommand, TEvent>) => state.testing.length >= 5 ? [] : // TODO: Make 5 configurable
    state.queued
        .slice(0, 5 - state.testing.length)
        .reduce<Events<TCommand, TEvent>[]>((events, id) => [
            ...events,
            Events<TCommand, TEvent>().StoryTestingStarted({
                id,
                script: state.stories[id],
            }),

            ...[...state.stories[id].background, state.stories[id].expectedInteraction]
                .map(x => Events<TCommand, TEvent>().NextCommandGenerated({
                    id: id,
                    command: x.trigger
                })),
        ], [])

function* StoryTestingTimeoutEvents<TCommand, TEvent>(state: State<TCommand, TEvent>, ms: number) {
    for (const story of state.testing) {
        const doesTimeout = story.elapsedTime + ms > state.stories[story.id].timeout;
        if (doesTimeout) {
            // If current story expects no event, pass it.
            const storyScript = state.stories[story.id];
            const allInteractions = [...storyScript.background, storyScript.expectedInteraction];
            const storyHistory = state.histories[story.id] || [];
            const cursor = FindExceptedEventPosition(allInteractions, { interactionIndex: 0, eventIndex: 0 }, storyHistory.filter(x => x.type == History.Tags.Event).length);

            if (cursor == "No Expectation")
                yield Events<TCommand, TEvent>().StoryConcluded(story.id).Pass();
            else
                yield Events<TCommand, TEvent>().StoryConcluded(story.id).Fail(Reason.Value<TCommand, TEvent>().Timeout({
                    message: "Timeout",
                    history: storyHistory,
                    waitingFor: allInteractions[cursor.interactionIndex].consequences[cursor.eventIndex],
                }));
        }
    }
}

