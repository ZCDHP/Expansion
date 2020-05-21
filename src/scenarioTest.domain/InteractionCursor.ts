import { Story as Script } from './script';

type Position = {
    interactionIndex: number,
    eventIndex: number,
}

type EventCursor =
    | Position
    | "No Expectation"

// Find the position of the next expected event
export const FindExceptedEventPosition: <TCommand, TEvent>(allInteractions: Script.Interaction<TCommand, TEvent>[], cursor: EventCursor, eventCount: number, ) => EventCursor = (allInteractions, cursor, eventCount) => {
    if (cursor == "No Expectation")
        return cursor;

    if (cursor.interactionIndex + 1 > allInteractions.length)
        return "No Expectation";

    const eventCountOfInteraction = allInteractions[cursor.interactionIndex].consequences.length;
    const leastRequiredEventCount = cursor.eventIndex + 1 + eventCount;

    if (eventCountOfInteraction < leastRequiredEventCount)
        return FindExceptedEventPosition(
            allInteractions,
            { interactionIndex: cursor.interactionIndex + 1, eventIndex: 0, },
            eventCount - eventCountOfInteraction
        );

    return {
        interactionIndex: cursor.interactionIndex,
        eventIndex: eventCount
    };
};