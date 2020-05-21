require('source-map-support').install();

import { Spec } from "../gConnection.spec/spec";
import { CommandHandler as TargetCommandHandler } from "../gConnection.domain/commandHandler";
import { Projection as TargetProjection, State as TargetState } from "../gConnection.domain/projection.player";
import { Command as TargetCommands } from "../gConnection.domain/commands";
import { Event as TargetEvents } from "../gConnection.domain/events";
import { Epic as EpicScript } from '../scenarioTest.domain/script';

import * as Report from "../scenarioTest.domain/report";
import { Test } from "./run";
import { Reason } from "../scenarioTest.domain/conclusion";

const script = EpicScript.Script({
    epic: Spec,
    produceEvents: TargetCommandHandler,
    projection: TargetProjection
});

const report = Test<TargetState, TargetCommands, TargetEvents>(script, TargetCommandHandler, TargetProjection);

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

//console.log(JSON.stringify(report, null, 2));

mochaify(report);
