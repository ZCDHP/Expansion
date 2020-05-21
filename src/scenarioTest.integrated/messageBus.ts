import * as Nats from "ts-nats";

import * as MB from '../infrastructure/messageBus';

import { Event } from '../scenarioTest.domain/events';
import { Command } from '../scenarioTest.domain/commands';

export const MessageBus: <TCommand, TEvent>(client: Nats.Client, streamName: string) => MB.MessageBus<Command<TCommand, TEvent>, Event<TCommand, TEvent>, number> = (client, streamName) =>
    MB.MessageBus(client, streamName, MB.Serializer.Number);
