import { Conclusion } from "./conclusion";
import { State } from "./state";
import * as Script from "./script";

export type Story<TCommand, TEvent> = {
    title: string,
    script: Script.Story.Script<TCommand, TEvent>,
    conclusion: Conclusion<TCommand, TEvent>,
}

export type Epic<TCommand, TEvent> = {
    title: string,
    children: (Epic<TCommand, TEvent> | Story<TCommand, TEvent>)[],
};


export const Generate: <TCommand, TEvent>(script: Script.Epic.Script<TCommand, TEvent>, finalState: State<TCommand, TEvent>) => Epic<TCommand, TEvent> = <TCommand, TEvent>(script: Script.Epic.Script<TCommand, TEvent>, finalState: State<TCommand, TEvent>) => {
    const dict = Script.Epic.IndexDictionary(script);

    const map: (epic: Script.Epic.IndexDictionary_Epic) => Epic<TCommand, TEvent> = epic => ({
        title: epic.title,
        children: epic.children.map(child => (child as any).children ? map(child as Script.Epic.IndexDictionary_Epic) : {
            title: child.title,
            script: finalState.stories[(child as Script.Epic.IndexDictionary_Story).index],
            conclusion: finalState.completed[(child as Script.Epic.IndexDictionary_Story).index],
        })
    });

    return map(dict);
};
