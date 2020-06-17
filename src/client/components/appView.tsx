import React from "react";
import { createGlobalStyle } from "styled-components";

import { State, Command } from "../domain/domain";
import * as Commands from "../domain/commands";

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
            <button onClick={_ => issueCommand(Commands.FindMatch())}> Login </button>
        </>
    )
}

