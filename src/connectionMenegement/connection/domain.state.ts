import * as Union from "../../infrastructure/union";
import * as EventUtils from "../../infrastructure/event";
import { Never } from "../../infrastructure/utils";

import { ConnectionNotification as Notification } from "../domain.notifications";

export namespace State {
    export const Tags = {
        None: "None",
        NotLoggedIn: "NotLoggedIn",
        LoggedIn: "LoggedIn",
    } as const;
    export type Tags = typeof Tags;

    export type None = Union.Case<Tags["None"], void>;
    export const None = Union.Case(Tags.None)<void>();

    export type NotLoggedIn = Union.Case<Tags["NotLoggedIn"], void>;
    export const NotLoggedIn = Union.Case(Tags.NotLoggedIn)<void>();

    export type LoggedIn = Union.Case<Tags["LoggedIn"], void>;
    export const LoggedIn = Union.Case(Tags.LoggedIn)<void>();

    export const Reducer: EventUtils.Reducer<State, Notification> = state => notification => {
        switch (notification.type) {
            case Notification.Tags.Connected: return state.type == Tags.None ? NotLoggedIn() : state;
            case Notification.Tags.LoggedIn: return state.type == Tags.NotLoggedIn ? LoggedIn() : state;
            default: Never(notification);
        }
    }

    export const Projection: EventUtils.Projection<State, Notification> = {
        initialState: None(),
        reducer: Reducer
    };
}

export type State =
    | State.None
    | State.NotLoggedIn
    | State.LoggedIn



