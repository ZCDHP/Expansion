import * as Domain from "./domain/domain";
import { CommandHandler } from "./domain/domain.commandHandler";
import { Subscription } from "./domain/domain.subscription";

import * as Context from "./context/context";
import { Reduce } from "../infrastructure/event";



type UpdateState = (s: Domain.State) => void;
type IssueCommand = (cmd: Domain.Command) => void;

export const State: (initial: Domain.State) => (onUpdate: UpdateState) => IssueCommand = initial => onUpdate => {
    let domain = initial;
    let context = Context.State.Initial();

    onUpdate(domain);

    const ExecuteCommand = (command: Domain.Command) => {
        const events = CommandHandler(domain)(command);
        domain = Reduce(Domain.State.Reducer)(domain)(events);

        events
            .map(e => {
                context = Context.Subscription(ExecuteAndUpdate)(e)(context);
                return Subscription(e)(domain);
            })
            .reduce<Domain.Command[]>((result, commands) => [...result, ...commands], [])
            .forEach(ExecuteCommand);
    };

    const ExecuteAndUpdate = (command: Domain.Command) => {
        ExecuteCommand(command);
        onUpdate(domain);
    }

    return ExecuteAndUpdate;
}
