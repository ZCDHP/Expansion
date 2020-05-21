import { Reduce, Projection } from "../infrastructure/event";

import * as Def from './epic';

export namespace Story {
    export type Interaction<TCommand, TEvent> = {
        trigger: TCommand,
        consequences: TEvent[],
    };

    export type Script<TCommand, TEvent> = {
        title: string
        timeout: number,
        background: Interaction<TCommand, TEvent>[],
        expectedInteraction: Interaction<TCommand, TEvent>,
    }

    export function Script<TCommand, TEvent, TState>(settings: {
        projection: Projection<TState, TEvent>,
        produceEvents: (state: TState) => (cmd: TCommand) => TEvent[],
        story: Def.Story<TCommand, TEvent>,
        timeout: number
    }): Script<TCommand, TEvent> {
        return {
            title: settings.story.title,
            timeout: settings.timeout,
            background: settings.story.given
                .reduce<{ layers: Interaction<TCommand, TEvent>[], state: TState }>((({ layers, state }, cmd) => {
                    const events = settings.produceEvents(state)(cmd);
                    return {
                        layers: [...layers, {
                            trigger: cmd,
                            consequences: events
                        }],
                        state: Reduce(settings.projection.reducer)(state)(events)
                    }
                }), { layers: [], state: settings.projection.initialState })
                .layers,
            expectedInteraction: {
                trigger: settings.story.when,
                consequences: settings.story.then,
            },
        }
    };
}

export namespace Epic {
    export type Script<TCommand, TEvent> = {
        title: string,
        children: (Story.Script<TCommand, TEvent> | Script<TCommand, TEvent>)[],
    }

    export function Script<TCommand, TEvent, TState>(settings: {
        projection: Projection<TState, TEvent>,
        produceEvents: (state: TState) => (cmd: TCommand) => TEvent[],
        epic: Def.Epic<TCommand, TEvent>,
    }): Script<TCommand, TEvent> {
        return {
            title: settings.epic.title,
            children: settings.epic.children.map(child => (child as any).children ?
                Script({ ...settings, epic: child as Def.Epic<TCommand, TEvent> }) :
                Story.Script({
                    projection: settings.projection,
                    produceEvents: settings.produceEvents,
                    story: child as Def.Story<TCommand, TEvent>,
                    timeout: 1000, // TODO: Config this
                })
            )
        }
    }


    export const Stories: <TCommand, TEvent>(epic: Script<TCommand, TEvent>) => Story.Script<TCommand, TEvent>[] = <TCommand, TEvent>(epic: Script<TCommand, TEvent>) => epic.children
        .map<Story.Script<TCommand, TEvent>[]>(child => (child as any).children ? Stories(child as Script<TCommand, TEvent>) : [child as Story.Script<TCommand, TEvent>])
        .reduce<Story.Script<TCommand, TEvent>[]>((result, arr) => [...result, ...arr], []);


    export type IndexDictionary_Story = {
        title: string,
        index: number,
    };

    export type IndexDictionary_Epic = {
        title: string,
        children: (IndexDictionary_Epic | IndexDictionary_Story)[]
    };

    export const IndexDictionary: <TCommand, TEvent>(epic: Script<TCommand, TEvent>) => IndexDictionary_Epic = epic => IndexDictionary_Inner(epic, 0).epic;

    const IndexDictionary_Inner: <TCommand, TEvent>(epic: Script<TCommand, TEvent>, storyIndex: number) => { epic: IndexDictionary_Epic, index: number } = <TCommand, TEvent>(epic: Script<TCommand, TEvent>, storyIndex: number) => {
        const { children, index } = epic.children.reduce<{
            children: (IndexDictionary_Epic | IndexDictionary_Story)[],
            index: number,
        }>((result, child) => {
            if ((child as any).children) {
                const { epic, index } = IndexDictionary_Inner(child as Script<TCommand, TEvent>, result.index);
                return {
                    children: [...result.children, epic],
                    index: index,
                };
            }
            else
                return {
                    children: [...result.children, { title: (child as Story.Script<TCommand, TEvent>).title, index: result.index }],
                    index: result.index + 1
                }
        }, {
            children: [],
            index: storyIndex
        });

        return {
            epic: {
                title: epic.title,
                children
            },
            index,
        };
    }
}

