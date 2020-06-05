require('source-map-support').install();

import { connect as NatsConnect } from "ts-nats";

import { Config as CommonConfig } from '../config/common';
import { Config as Config } from '../config/gConnection';

import { Reduce } from "../infrastructure/event";
import { MessageBus } from '../infrastructure/messageBus';

import { Epic as EpicScript } from '../scenarioTest.domain/script';
import { CommandHandler as TestingCommandHandler } from '../scenarioTest.domain/commandHandler';
import { Command as TestingCommand } from '../scenarioTest.domain/commands';
import { Event as TestingEvents, Tags as TestingEventTags } from '../scenarioTest.domain/events';
import { Projection as TestingProjection, Reducer as TestingReducer, State as TestingState } from '../scenarioTest.domain/state';
import * as Report from "../scenarioTest.domain/report";

import { Spec } from "../gConnection.spec/spec";
import { MessageBus as TargetMessageBus } from '../gConnection.service/messageBus';
import { CommandHandler as TargetCommandHandler } from "../gConnection.domain/commandHandler";
import { Projection as TargetProjection } from "../gConnection.domain/projection.player";
import { Reason } from "../scenarioTest.domain/conclusion";
import { Id } from "../infrastructure/utils";

const ExecuteTestingCommand: <TCommand, TEvent>(command: TestingCommand<TCommand, TEvent>) => (state: TestingState<TCommand, TEvent>) => [TestingState<TCommand, TEvent>, TestingEvents<TCommand, TEvent>[]] =
    <TCommand, TEvent>(command: TestingCommand<TCommand, TEvent>) => (state: TestingState<TCommand, TEvent>) => {
        const newTestingEvents = TestingCommandHandler<TCommand, TEvent>()(state)(command);
        const newTestingState = Reduce<TestingState<TCommand, TEvent>, TestingEvents<TCommand, TEvent>>
            (TestingReducer<TCommand, TEvent>())
            (state)
            (newTestingEvents);

        return [newTestingState, newTestingEvents];
    }

const Test:
    <TCommand, TEvent, TId>(script: EpicScript.Script<TCommand, TEvent>, targetMessageBus: MessageBus<TCommand, TEvent, TId>, serializeId: (s: number) => TId, deserializeId: (v: TId) => number) => Promise<Report.Epic<TCommand, TEvent>> =
    <TCommand, TEvent, TId>(script: EpicScript.Script<TCommand, TEvent>, targetMessageBus: MessageBus<TCommand, TEvent, TId>, serializeId: (s: number) => TId, deserializeId: (v: TId) => number) => {
        return new Promise<Report.Epic<TCommand, TEvent>>((resolve, _reject) => {
            let testingState = TestingProjection<TCommand, TEvent>().initialState;

            const ExecuteCommand_Local = (cmd: TestingCommand<TCommand, TEvent>) => {
                const [newTestingState, events] = ExecuteTestingCommand<TCommand, TEvent>(cmd)(testingState);
                testingState = newTestingState;
                events.forEach(onTestingEvent);
                return;
            };

            const timeout = setInterval(() => ExecuteCommand_Local(TestingCommand<TCommand, TEvent>().PassTime(10)), 10);

            const onTestingEvent = (event: TestingEvents<TCommand, TEvent>) => {
                switch (event.type) {
                    case TestingEventTags.NextCommandGenerated:
                        targetMessageBus.publishCommand(serializeId(event.data.id), event.data.command);
                        return;
                    case TestingEventTags.Completed:
                        clearInterval(timeout);
                        resolve(Report.Generate(script, testingState))
                        return;
                    default: return;
                }
            };

            targetMessageBus.subscribeEvent((id, event) =>
                ExecuteCommand_Local(TestingCommand<TCommand, TEvent>().VerifyTargetEvent({
                    id: deserializeId(id),
                    event: event
                }))
            );

            ExecuteCommand_Local(TestingCommand<TCommand, TEvent>().Start(script));
        });
    }


const mochaify: <TCommand, TEvent>(epic: Report.Epic<TCommand, TEvent>) => void = <TCommand, TEvent>(epic: Report.Epic<TCommand, TEvent>) => {
    describe(epic.title, () => {
        for (const child of epic.children) {
            if ((child as any).children)
                mochaify(child as Report.Epic<TCommand, TEvent>);
            else {
                const story = child as Report.Story<TCommand, TEvent>;
                it(story.title, () => {
                    if (!story.conclusion.passed) {
                        throw Reason.ToError(story.conclusion.reason, story.script);
                    }

                })
            }
        }
    })

}

async function main() {
    console.log("Main");

    const script = EpicScript.Script({
        epic: Spec,
        produceEvents: TargetCommandHandler,
        projection: TargetProjection
    });

    console.log(JSON.stringify(CommonConfig));
    console.log(JSON.stringify(Config));
    const natsClient = await NatsConnect(CommonConfig.eventBusNatsUrl);

    const targetMessageBus = TargetMessageBus(natsClient, Config);

    const report = await Test(script, targetMessageBus, Id, Id);

    mochaify(report);
}



it("Integrated Scenario Testing", async () => {
    await main();
});

