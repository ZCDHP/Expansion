import * as Nats from "ts-nats";

import * as MB from '../infrastructure/messageBus';
import * as Serializer from '../infrastructure/messageBus.serializer';
import { Config } from '../config/gConnection';

import { Event } from '../gConnection.domain/events';
import { Command } from '../gConnection.domain/commands';

export const MessageBus: (client: Nats.Client, config: Config) => MB.MessageBus<Command, Event, number> = (client, config) =>
    MB.MessageBus(client, config.Prefix, Serializer.Number);
