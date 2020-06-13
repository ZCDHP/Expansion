import { EventEmitter } from "events";


export type MessageBroker<T> = {
    publish: (message: T) => void,
    subscribe: (handler: (message: T) => void) => void,
}

export const MessageBroker: <T>() => MessageBroker<T> = () => {
    const emitter = new EventEmitter();

    return {
        publish: message => emitter.emit("data", message),
        subscribe: handler => emitter.addListener("data", handler),
    };
}
