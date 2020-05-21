import { Story, Epic } from "../epic";
import { Command as Commands } from "../../gConnection.domain/commands";
import * as Events from "../../gConnection.domain/events";

export const Spec =
    Epic("Command: Disconnect")([
        Story("Does disconnect")({
            Given: [Commands.Connect()],
            When: Commands.Disconnect(),
            Then: [Events.Event.Disconnected()],
        }),
        Epic("Does Nothing when")([
            Story("Not connected")({
                Given: [],
                When: Commands.Disconnect(),
                Then: [],
            }),
            Story("Double termination for Player")({
                Given: [
                    Commands.Connect(),
                    Commands.Disconnect()
                ],
                When: Commands.Disconnect(),
                Then: [],
            }),
        ]),
    ]);
