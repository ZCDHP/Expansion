import React from "react";
import { createGlobalStyle } from "styled-components";

import { State } from "../state";
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
    issueCommand: (cmd: Command) => void
}

export const AppView = ({ state, issueCommand }: Props) => {
    return (
        <>
            <GlobalStyle />
            <h1>{state.login.type}</h1>
            <button onClick={_ => issueCommand(Command.Login({ id: 1 }))}> Login </button>
        </>
    )
}

