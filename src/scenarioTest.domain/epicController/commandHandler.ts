import { Never } from '../../infrastructure/utils';

import { Events } from './events';
import { Commands as Commands, Tags as CommandTags } from './commands';
//import { Value as State, Tags as StateTags } from './state';


export const CommandHandler: <TCommand, TEvent>() => (cmd: Commands<TCommand, TEvent>) /* => (state: State<TCommand, TEvent>) */ => Events<TCommand, TEvent>[] =
    <TCommand, TEvent>() => (cmd: Commands<TCommand, TEvent>)/*  => (state: State<TCommand, TEvent>) */ => {
        switch (cmd.type) {
            case CommandTags.Start: return [Events<TCommand, TEvent>().Started(cmd.data)];
            case CommandTags.PassTime: return [Events<TCommand, TEvent>().TimePassed(cmd.data)];
            default: return Never(cmd)
        }
    }

