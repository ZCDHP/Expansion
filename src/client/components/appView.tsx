import React from "react";
import { createGlobalStyle } from "styled-components";

import { State } from "../viewState";
//import { Operation } from "../operations";
import { Command } from "../commands";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0px;
        padding: 0px;
    }  
`;

type Props = {
    state: State,
    issueCommand: (command: Command) => void,
}

export const AppView = ({ state, issueCommand }: Props) => {
    return (
        <>
            <GlobalStyle />
            <h1>Connection: {JSON.stringify(state.Connection)}</h1>
            <button onClick={_ => issueCommand(Command.Connection.Connect())}> Login </button>
        </>
    )
}

