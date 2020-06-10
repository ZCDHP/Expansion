import { Map } from "../../infrastructure/map";
import { Never } from "../../infrastructure/utils";

import * as Domain from "./domain";


type Handler<T> = (state: Domain.State) => (notification: T) => [Domain.State, Domain.Operation[]]

export const HandleNotification: Handler<Domain.Notification> = state => notification => {
    switch (notification.type) {
        case Domain.Notification.Tags.Connection:
            return HandleConnectionNotification(state)(notification.data);
        case Domain.Notification.Tags.TimePassed:
            return HandleTimePassedNotification(state)(notification);
        default: Never(notification);
    }
}


const HandleConnectionNotification: Handler<Domain.Notification.NotificationForConnection> = state => notification => {
    switch (notification.data.type) {
        case Domain.ConnectionNotification.Tags.Connected: return HandleConnectionNotification_Connected(notification.connectionId)(state)(notification.data);
        case Domain.ConnectionNotification.Tags.LoggedIn: return HandleConnectionNotification_LoggedIn(notification.connectionId)(state)(notification.data);
        default: Never(notification.data);
    }
}

const HandleConnectionNotification_Connected: (connectionId: number) => Handler<Domain.ConnectionNotification.Connected> = connectionId => state => _notification => [
    Map.Set(state)(connectionId, Domain.State.Init),
    []
];

const HandleConnectionNotification_LoggedIn: (connectionId: number) => Handler<Domain.ConnectionNotification.LoggedIn> = connectionId => state => _notification => [
    Map.Remove(state)(connectionId),
    []
];

const HandleTimePassedNotification: Handler<Domain.Notification.TimePassed> = state => notification => {
    const newState = Domain.State.AddTime(state)(notification.data.ms);

    const operations = Map.Iterate(newState)
        ((id, time) => ({ id, time: time == Domain.State.Init ? 0 : time }))
        .filter(x => x.time >= 5000)
        .map(x => Domain.Operation.Disconnect({
            connectionId: x.id,
            reason: "Not logged in in time"
        }));

    return [newState, operations];
};
