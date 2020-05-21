import { AssertionError } from 'assert';

import * as Union from "../infrastructure/union";

import { FindExceptedEventPosition } from './InteractionCursor';
import * as History from "./history";
import { Story } from "./script";
import { Never } from '../infrastructure/utils';

export type Conclusion<TCommand, TEvent> =
    | Pass
    | Fail<TCommand, TEvent>
export type Pass = { passed: true }
export const Pass = () => ({ passed: true }) as Pass;

export type Fail<TCommand, TEvent> = { passed: false, reason: Reason.Value<TCommand, TEvent> };
export const Fail = <TCommand, TEvent>(reason: Reason.Value<TCommand, TEvent>) => ({ passed: false, reason });

export namespace Reason {
    export const Tags = {
        UnexpectedEvent: "UnexpectedEvent",
        Timeout: "Timeout",
    } as const;
    export type Tags = typeof Tags;

    export type UnexpectedEventData<TCommand, TEvent> = {
        message: string,
        history: History.Record<TCommand, TEvent>[],
        actual: TEvent,
        expected: TEvent | null,
    }
    export type UnexpectedEvent<TCommand, TEvent> = Union.Case<Tags["UnexpectedEvent"], UnexpectedEventData<TCommand, TEvent>>;

    export type TimeoutData<TCommand, TEvent> = {
        message: string,
        history: History.Record<TCommand, TEvent>[],
        waitingFor: TEvent,
    }
    export type Timeout<TCommand, TEvent> = Union.Case<Tags["Timeout"], TimeoutData<TCommand, TEvent>>;

    export type Value<TCommand, TEvent> =
        | UnexpectedEvent<TCommand, TEvent>
        | Timeout<TCommand, TEvent>

    export const Value = <TCommand, TEvent>() => ({
        UnexpectedEvent: Union.Case(Tags.UnexpectedEvent)<UnexpectedEventData<TCommand, TEvent>>(),
        Timeout: Union.Case(Tags.Timeout)<TimeoutData<TCommand, TEvent>>(),
    });

    const LeadSpace = "      ";

    export const ToError: <TCommand, TEvent>(reason: Value<TCommand, TEvent>, script: Story.Script<TCommand, TEvent>) => AssertionError = (reason, script) => {
        switch (reason.type) {
            case Tags.UnexpectedEvent:
                return new AssertionError({
                    message: `${reason.data.message}\n${LeadSpace}History:\n${LeadSpace}${StringifyHistory(reason.data.history, script)}`,
                    actual: reason.data.actual,
                    expected: reason.data.expected || "Nothing",
                    stackStartFn: () => "",
                });

            case Tags.Timeout:
                return new AssertionError({
                    message: `${reason.data.message}\n${LeadSpace}History:\n${LeadSpace}${StringifyHistory(reason.data.history, script)}\nWaiting for event: ${JSON.stringify(reason.data.waitingFor)}`,
                    stackStartFn: () => "",
                });

            default: return Never(reason);
        }
    }

    const StringifyHistory: <TCommand, TEvent> (history: History.Record<TCommand, TEvent>[], script: Story.Script<TCommand, TEvent>) => string = <TCommand, TEvent>(history: History.Record<TCommand, TEvent>[], script: Story.Script<TCommand, TEvent>) => {
        console.dir(history);
        console.dir(history.filter(x => x.type == History.Tags.Event).length);

        const interactions = [...script.background, script.expectedInteraction];
        const cursor = FindExceptedEventPosition(interactions, { eventIndex: 0, interactionIndex: 0 }, history.filter(x => x.type == History.Tags.Event).length);

        console.dir(cursor);

        const isEventReceived = (interactionIndex: number, eventIndex: number) => {
            if (cursor == "No Expectation")
                return true;

            if (interactionIndex < cursor.interactionIndex)
                return true;
            if (interactionIndex > cursor.interactionIndex)
                return false;
            return eventIndex < cursor.eventIndex;
        }

        const StringifyEvent = (interactionIndex: number, eventIndex: number, event: TEvent) =>
            `  ${LeadSpace}${isEventReceived(interactionIndex, eventIndex) ? "√" : "×"} ${JSON.stringify(event)}`;

        return interactions
            .map((interaction, interactionIndex) => `${JSON.stringify(interaction.trigger)}\n${interaction.consequences.map((event, eventIndex) => StringifyEvent(interactionIndex, eventIndex, event)).join(`\n`)}`)
            .join(`\n${LeadSpace}`)
    }
}
