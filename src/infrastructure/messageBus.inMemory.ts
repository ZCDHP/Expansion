export type MessageBus<Command, Event, AggregationId> = {
    publishCommand: (aggregationId: AggregationId, command: Command) => void,
    subscribeEvent: (onData: (aggregationId: AggregationId, event: Event) => void) => void,
}


type Service<Command, Event, AggregationId> = (id: AggregationId) => (command: Command) => Promise<Event[]>;


export const MessageBus: <Command, Event, AggregationId>(service: Service<Command, Event, AggregationId>) => MessageBus<Command, Event, AggregationId> =
    <Command, Event, AggregationId>(service: Service<Command, Event, AggregationId>) => {
        let subscription: (aggregationId: AggregationId, event: Event) => void = _ => { };

        return {
            publishCommand: (aggregationId: AggregationId, command: Command) => service(aggregationId)(command).then(events => events.forEach(e => subscription(aggregationId, e))),
            subscribeEvent: (onData: (aggregationId: AggregationId, event: Event) => void) => subscription = onData,
        };
    }
