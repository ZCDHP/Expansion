import ReactDOM from "react-dom";
import React from "react";

import { App } from "./app";

const domReady = new Promise(r => document.addEventListener("DOMContentLoaded", r));

const InitialState = () => (window as any).initialState as { str: string };

async function main() {
    await domReady;
    ReactDOM.hydrate(<App {...InitialState()} />, document.getElementById("app"));
}
main();

