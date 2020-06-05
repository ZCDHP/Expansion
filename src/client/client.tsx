import ReactDOM from "react-dom";
import React from "react";

import { State as ViewState } from "./view/state";
import { App } from "./components/app";

const domReady = new Promise(r => {
    if (document.readyState === "interactive" || document.readyState === "complete")
        r();
    else
        document.addEventListener("DOMContentLoaded", r)
});

const InitialState = () => (window as any).initialState as ViewState;

async function main() {
    await domReady;
    ReactDOM.hydrate(<App {...InitialState()} />, document.getElementById("app"));
}
main();
