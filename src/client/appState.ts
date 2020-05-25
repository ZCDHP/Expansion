import { State as ViewState } from './state';
import { Command } from "./commands";

export type State = {
    viewState: ViewState,
    issueCommand: (cmd: Command) => void,
}