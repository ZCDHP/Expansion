import React from "react";
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
   * {
        box-sizing: border-box;
        margin: 0px;
        padding: 0px;
   }   
`;

export const App = (input: { str: string }) => <><GlobalStyle /><h1>{input.str}</h1></>;
