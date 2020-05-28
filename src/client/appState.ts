import * as ViewState from './viewState';
import * as ContextualState from './context';

export type State = {
    viewState: ViewState.State,
    contextualState: ContextualState.State,
};
