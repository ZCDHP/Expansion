import * as Union from "../infrastructure/union";

export const Tags = {
    None: "None",
    Connecting: "Connecting",
    Connected: "Connected",
    Failed: "Failed",
} as const;
export type Tags = typeof Tags;

export type None = Union.Case<Tags["None"], void>;
export type Connecting = Union.Case<Tags["Connecting"], void>;
export type Connected = Union.Case<Tags["Connected"], void>;
export type Failed = Union.Case<Tags["Failed"], { reason: string }>;

export type State =
    | None
    | Connecting
    | Connected
    | Failed

export const State = {
    None: Union.Case(Tags.None)<void>(),
    Connecting: Union.Case(Tags.Connecting)<void>(),
    Connected: Union.Case(Tags.Connected)<void>(),
    Failed: Union.Case(Tags.Failed)<{ reason: string }>(),
}

export const InitialState: State = State.None();

export type Operation<T> = (v: T) => (state: State) => State;

const Connect: Operation<void> = () => state => state.type == Tags.None ? State.Connecting() : state;
const Connected: Operation<void> = () => state => state.type == Tags.Connecting ? State.Connected() : state;

export const Operations = {
    Connect,
    Connected,
};
