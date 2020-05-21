import * as Nats from "ts-nats";

import { Id } from "./utils";


export type MessageBus<Command, Event, AggregationId> = {
    publishCommand: (aggregationId: AggregationId, command: Command) => void,
    subscribeCommand: (onData: (aggregationId: AggregationId, command: Command) => void, onError?: (err: Nats.NatsError) => void) => void,
    publishEvent: (aggregationId: AggregationId) => (event: Event) => void,
    subscribeEvent: (onData: (aggregationId: AggregationId, event: Event) => void, onError?: (err: Nats.NatsError) => void) => void,
}

export type Serializer<T> = {
    serialize: (v: T) => string,
    deserialize: (s: string) => T
};

export namespace Serializer {
    export const String: Serializer<string> = {
        serialize: Id,
        deserialize: Id,
    }

    export const Number: Serializer<number> = {
        serialize: n => n.toString(),
        deserialize: parseInt,
    };
}

export const MessageBus: <Command, Event, AggregationId>(client: Nats.Client, streamName: string, serializer: Serializer<AggregationId>) => MessageBus<Command, Event, AggregationId> = (client, streamName, serializer) => {
    return {
        publishCommand: PublishCommand(streamName, client, serializer),
        subscribeCommand: SubscribeCommand(streamName, client, serializer),
        publishEvent: PublishEvent(streamName, client, serializer),
        subscribeEvent: SubscribeEvent(streamName, client, serializer),
    }
};

const PublishCommand: <Command, AggregationId>(streamName: string, client: Nats.Client, serializer: Serializer<AggregationId>) => (aggregationId: AggregationId, command: Command) => void =
    (streamName, client, { serialize }) => (aggregationId, command) =>
        client.publish(`${streamName}.Command.${serialize(aggregationId)}`, JSON.stringify(command));

const SubscribeCommand: <Command, AggregationId>(streamName: string, client: Nats.Client, serializer: Serializer<AggregationId>) => (onData: (aggregationId: AggregationId, command: Command) => void, onError?: (err: Nats.NatsError) => void) => void =
    (streamName, client, { deserialize }) => (onData, onError) =>
        Subscribe<Parameters<typeof onData>[1]>(client, `${streamName}.Command.*`,
            (key, command) => onData(deserialize(key), command),
            onError);

const PublishEvent: <Event, AggregationId>(streamName: string, client: Nats.Client, serializer: Serializer<AggregationId>) => (aggregationId: AggregationId) => (event: Event) => void =
    (streamName, client, { serialize }) => aggregationId => event =>
        client.publish(`${streamName}.Event.${serialize(aggregationId)}`, JSON.stringify(event));

const SubscribeEvent: <Event, AggregationId>(streamName: string, client: Nats.Client, serializer: Serializer<AggregationId>) => (onData: (aggregationId: AggregationId, event: Event) => void, onError?: (err: Nats.NatsError) => void) => void =
    (streamName, client, { deserialize }) => (onData, onError) =>
        Subscribe<Parameters<typeof onData>[1]>(client, `${streamName}.Event.*`,
            (key, event) => onData(deserialize(key), event),
            onError);



const Subscribe: <T>(client: Nats.Client, subject: string, onData: (key: string, data: T) => void, onError?: (err: Nats.NatsError) => void) => void =
    (client, subject, onData, onError) => client.subscribe(subject, (err, message) => {
        if (err) {
            onError ?
                onError(err) :
                console.log(JSON.stringify(err));
            return;
        }

        const key = message.subject.split(".").pop() as string;
        onData(key, JSON.parse(message.data as string));
    })

