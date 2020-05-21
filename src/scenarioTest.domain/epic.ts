export type Story<TCommand, TEvent> = {
    title: string,
    given: TCommand[],
    when: TCommand,
    then: TEvent[],
};

export const StoryOf: <TCommand, TEvent>() => (title: string) => (data: {
    Given: TCommand[],
    When: TCommand,
    Then: TEvent[],
}) => Story<TCommand, TEvent> =
    () => title => ({ Given: given, When: when, Then: then }) => ({
        title,
        given,
        when,
        then,
    });


export type Epic<TCommand, TEvent> = {
    title: string,
    children: (Story<TCommand, TEvent> | Epic<TCommand, TEvent>)[],
}

export const EpicOf: <TCommand, TEvent>() => (title: string) => (children: (Story<TCommand, TEvent> | Epic<TCommand, TEvent>)[]) => Epic<TCommand, TEvent> =
    () => title => children => ({
        title,
        children,
    });

export const Stories: <TCommand, TEvent>(epic: Epic<TCommand, TEvent>) => Story<TCommand, TEvent>[] = <TCommand, TEvent>(epic: Epic<TCommand, TEvent>) => epic.children
    .map<Story<TCommand, TEvent>[]>(child => (child as any).children ? Stories(child as Epic<TCommand, TEvent>) : [child as Story<TCommand, TEvent>])
    .reduce<Story<TCommand, TEvent>[]>((result, arr) => [...result, ...arr], []);
