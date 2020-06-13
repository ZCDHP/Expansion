import React from "react";
import { createGlobalStyle } from "styled-components";

import { State } from "../view/state";
import { Command } from "../view/commands";

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
            <h1>Login: {JSON.stringify(state.Login)}</h1>
            {state.Login.type == "None" && <button onClick={_ => issueCommand(Command.Constructor.Login.Start())}> Login </button>}
        </>
    )
}

