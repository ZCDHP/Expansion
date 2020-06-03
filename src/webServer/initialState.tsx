import React from "react"

import { State as ViewState } from "../client/view/state";

const InitialState = (state: ViewState) => (
    <script dangerouslySetInnerHTML={{
        __html: `window.initialState = ${JSON.stringify(state)};`
    }}>
    </script>
)

export default InitialState;
