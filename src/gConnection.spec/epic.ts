import { StoryOf, EpicOf } from "../scenarioTest.domain/epic";
import * as Commands from "../gConnection.domain/commands";
import * as Events from "../gConnection.domain/events";

export const Story = StoryOf<Commands.Command, Events.Event>();
export const Epic = EpicOf<Commands.Command, Events.Event>();
