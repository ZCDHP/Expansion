import { Never } from '../../infrastructure/utils';

import { Value as Events } from './events';
import { Commands as Commands, Tags as CommandTags } from './commands';
import { Value as State, Tags as StateTags } from './state';

export const CommandHandler: <TCommand, TEvent>() => (cmd: Commands<TCommand, TEvent>) => (state: State<TCommand, TEvent>) => Events<TCommand, TEvent>[] =
    <TCommand, TEvent>() => (cmd: Commands<TCommand, TEvent>) => (state: State<TCommand, TEvent>) => {
        switch (cmd.type) {
            case CommandTags.Start: switch (state.type) {
                case StateTags.Uninitialized: return [Events<TCommand, TEvent>().Initialized(cmd.data)];
                default: return IllegalProcess(cmd)(state);
            }
            case CommandTags.PassTime: switch (state.type) {
                case StateTags.Testing:
                    const doesTimeout = state.data.elapsedTime + cmd.data > state.data.script.timeout;
                    return [
                        Events<TCommand, TEvent>().TimePassed(cmd.data),
                        ...(doesTimeout ?
                            [Events<TCommand, TEvent>().Concluded.Fail("Timeout")] :
                            [])
                    ];
                default: return IllegalProcess<TCommand, TEvent>(cmd)(state);
            }
            default: return Never(cmd);
        }
    }

const IllegalProcess: <TCommand, TEvent>(cmd: Commands<TCommand, TEvent>) => (state: State<TCommand, TEvent>) => Events<TCommand, TEvent>[] =
    <TCommand, TEvent>(cmd: Commands<TCommand, TEvent>) => (state: State<TCommand, TEvent>) => [
        Events<TCommand, TEvent>().Concluded.Fail({
            message: "Unexpected Story Testing Process",
            command: cmd,
            state: state,
        })
    ];
