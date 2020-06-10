import { Map } from "../../infrastructure/map";

export namespace State {
    export const Init = "Init";
    export type Init = typeof Init;

    export type Time = number | Init;// unit: ms

    const TimeAddition = (additionTime: number) => (originTime: Time) => (originTime == Init ? 0 : originTime) + additionTime;

    export const AddTime: (s: State) => (additionTime: number) => State = state => additionTime => Map.Map(state)(TimeAddition(additionTime));
}

export type State = Map<number, State.Time>
