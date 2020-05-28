import React from "react";
import { createGlobalStyle } from "styled-components";

import { State } from "../viewState";
import { Operation } from "../operations";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0px;
        padding: 0px;
    }  
`;

type Props = {
    state: State,
    applyOption: (operation: Operation) => void,
}

export const AppView = ({ state, applyOption }: Props) => {
    return (
        <>
            <GlobalStyle />
            <h1>Connection: {JSON.stringify(state.Connection)}</h1>
            <button onClick={_ => applyOption(Operation.Connection.Connect())}> Login </button>
        </>
    )
}

