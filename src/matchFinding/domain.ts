import { Never } from "../infrastructure/utils";
import * as EventDef from "../infrastructure/event";

import { Event, Command } from "../contracts/matchFinding";
export { Event, Command };


export namespace State {
    export const Initial: () => State = () => [];

    export const Reducer: EventDef.Reducer<State, Event> = state => event => {
        switch (event.type) {
            case Event.Tags.PlayerQueued:
                return [...state, event.data.playerId];
            case Event.Tags.FindingCancelled:
                return state.filter(x => x != event.data.playerId);
            case Event.Tags.MatchFound:
                return state.filter(x => !event.data.playerIds.includes(x));
            default: Never(event);
        }
    }
}

export type State = number[];


namespace CommandHandlers {
    export const QueuePlayer: (cmd: Command.QueuePlayer) => (state: State) => Event[] = ({ data: { playerId } }) => state => {
        if (state.includes(playerId))
            return [];

        return [
            Event.PlayerQueued({ playerId }),
            ...(state.length >= 1 ? [Event.MatchFound({ playerIds: [state[0], playerId] })] : []),
        ];
    }

    export const CancelFinding: (cmd: Command.CancelFinding) => (state: State) => Event[] = ({ data: { playerId } }) => state => {
        if (!state.includes(playerId))
            return [];

        return [Event.PlayerQueued({ playerId })];
    }

}

export const CommandHandler: (cmd: Command) => (state: State) => Event[] = cmd => {
    switch (cmd.type) {
        case Command.Tags.QueuePlayer: return CommandHandlers.QueuePlayer(cmd);
        case Command.Tags.CancelFinding: return CommandHandlers.CancelFinding(cmd);
        default: Never(cmd);
    }
}
