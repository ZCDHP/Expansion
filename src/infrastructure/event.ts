export type Reducer<TState, TEvent> = (s: TState) => (e: TEvent) => TState;

export type Projection<TState, TEvent> = {
    reducer: Reducer<TState, TEvent>,
    initialState: TState
};

export const Reduce: <TState, TEvent>(reducer: Reducer<TState, TEvent>) => (initialState: TState) => (events: TEvent[]) => TState =
    projection => initialState => events => events.reduce((s, e) => projection(s)(e), initialState);

//export type Producer<State, Command, Event> = (state: State) => (cmd: Command) => Event[];
