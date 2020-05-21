import { Story, Epic } from "../epic";
import * as Commands from "../../gConnection.domain/commands";
import * as Events from "../../gConnection.domain/events";

export const Spec =
    Epic("Command: Connect")([
        Story("Does connect")({
            Given: [],
            When: Commands.Command.Connect(),
            Then: [Events.Event.Connected()],
        }),
        Epic("Should be rejected when")([
            Story("Player connected to another Connection")({
                Given: [Commands.Command.Connect()],
                When: Commands.Command.Connect(),
                Then: [Events.Event.Rejected.Player_Already_Connected()],
            }),
        ]),
    ]);
