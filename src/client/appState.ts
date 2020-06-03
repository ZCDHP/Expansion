import * as ViewState from './view/state';
import * as ContextualState from './context/state';

export type State = {
    viewState: ViewState.State,
    contextualState: ContextualState.State,
};
