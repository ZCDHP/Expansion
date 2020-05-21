require('source-map-support').install();

import { Reduce, Projection } from "../infrastructure/event";
import * as Report from "../scenarioTest.domain/report";

import { Epic as EpicScript } from '../scenarioTest.domain/script';
import { CommandHandler as TestingCommandHandler } from '../scenarioTest.domain/commandHandler';
import { Commands as TestingCommands } from '../scenarioTest.domain/commands';
import { Event as TestingEvents, Tags as TestingEventTags } from '../scenarioTest.domain/events';
import { Projection as TestingProjection, Reducer as TestingReducer, State as TestingState } from '../scenarioTest.domain/state';

type Context<TState, TCommand, TEvent> = {
    script: EpicScript.Script<TCommand, TEvent>,
    targetStates: {
        [id: number]: TState,
    },
    targetCommandHandler: (state: TState) => (cmd: TCommand) => TEvent[],
    targetProjection: Projection<TState, TEvent>,

    testingState: TestingState<TCommand, TEvent>,
    pendingTargetCommands: { id: number, command: TCommand }[],
    pendingTestingCommands: TestingCommands<TCommand, TEvent>[],
}

const NextTick: <TState, TCommand, TEvent>(context: Context<TState, TCommand, TEvent>) => Report.Epic<TCommand, TEvent> = <TState, TCommand, TEvent>(context: Context<TState, TCommand, TEvent>) => {
    if (context.pendingTargetCommands.length != 0) {
        const { id, command } = context.pendingTargetCommands[0];
        const state = context.targetStates[id] == null ? context.targetProjection.initialState : context.targetStates[id];
        const newTargetEvents = context.targetCommandHandler(state)(command);
        return NextTick({
            ...context,
            pendingTargetCommands: context.pendingTargetCommands.slice(1),
            pendingTestingCommands: [
                ...context.pendingTestingCommands,
                ...newTargetEvents.map(e => TestingCommands<TCommand, TEvent>().VerifyTargetEvent({
                    id,
                    event: e
                })),
            ],
            targetStates: {
                ...context.targetStates,
                [id]: Reduce(context.targetProjection.reducer)(state)(newTargetEvents),
            },
        });
    }

    if (context.pendingTestingCommands.length != 0) {
        const newTestingEvents = TestingCommandHandler<TCommand, TEvent>()(context.testingState)(context.pendingTestingCommands[0]);
        const newTestingState = Reduce<TestingState<TCommand, TEvent>, TestingEvents<TCommand, TEvent>>
            (TestingReducer<TCommand, TEvent>())
            (context.testingState)
            (newTestingEvents);

        const newTargetCommands = newTestingEvents.reduce<{ id: number, command: TCommand }[]>((result, e) => e.type == TestingEventTags.NextCommandGenerated ? [...result, e.data] : result, [])

        /* for (const event of newTestingEvents) {
            console.log(JSON.stringify(event, null, 2));
            //console.log(newTestingState.testing.length);
        } */


        if (newTestingEvents.some(x => x.type == TestingEventTags.Completed))
            return Report.Generate(context.script, context.testingState);

        return NextTick({
            ...context,
            pendingTestingCommands: context.pendingTestingCommands.slice(1),
            pendingTargetCommands: [
                ...context.pendingTargetCommands,
                ...newTargetCommands,
            ],
            testingState: newTestingState,
        });
    }

    return NextTick({
        ...context,
        pendingTestingCommands: [TestingCommands<TCommand, TEvent>().PassTime(1000)]
    });
}

export const Test:
    <TState, TCommand, TEvent>(script: EpicScript.Script<TCommand, TEvent>, commandHandler: (state: TState) => (cmd: TCommand) => TEvent[], projection: Projection<TState, TEvent>) => Report.Epic<TCommand, TEvent> =
    <TState, TCommand, TEvent>(script: EpicScript.Script<TCommand, TEvent>, commandHandler: (state: TState) => (cmd: TCommand) => TEvent[], projection: Projection<TState, TEvent>) => {
        return NextTick({
            script: script,
            targetStates: {},
            targetProjection: projection,
            targetCommandHandler: commandHandler,
            testingState: TestingProjection<TCommand, TEvent>().initialState,
            pendingTargetCommands: [],
            pendingTestingCommands: [TestingCommands<TCommand, TEvent>().Start(script)]
        });
    }


