import { Never } from "../../infrastructure/utils";

import * as Domain from "./domain";

type Handler<T> = (state: Domain.State) => (notification: T) => [Domain.State, Domain.Operation[]]

export const HandleNotification: Handler<Domain.Notification> = state => notification => {
    switch (notification.type) {
        case Domain.Notification.Tags.Connected:
            return HandleConnectedNotification(state)(notification);
        case Domain.Notification.Tags.LoggedIn:
            return HandleLoggedInNotification(state)(notification);
        default: Never(notification);
    }
}


export const HandleConnectedNotification: Handler<Domain.Notification.Connected> = state => _notification =>
    state.type == Domain.State.Tags.None ?
        [Domain.State.NotLoggedIn(), []] :
        [state, []]

export const HandleLoggedInNotification: Handler<Domain.Notification.LoggedIn> = state => _notification =>
    state.type == Domain.State.Tags.LoggedIn ?
        [Domain.State.NotLoggedIn(), []] :
        [state, []];
