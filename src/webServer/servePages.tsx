import koa from 'koa';
import React from "react";
import ReactDOM from "react-dom/server";
import { ServerStyleSheet } from 'styled-components';

import { Files as Bundles } from "../building/bundles";
const Manifest: { [key in Bundles]: string } = require("../www/manifest.json");

import InitialState from './initialState';
import { App } from '../client/app'
//import * as View from '../client/types/viewState'
//import { Value as Page } from '../client/types/page'
//import { Value as GConnection } from "../client/types/gConnection";


const state = {
    str: "Hello World"
};

const HTML = (state: { str: string }) => (
    <html>
        <head>
            <title>Expansion</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Expansion - The Card Game" />
            <InitialState state={state} />
            <script src={`/${Manifest[Bundles.vendor]}`}></script>
            <script src={`/${Manifest[Bundles.app]}`}></script>
        </head>
        <body>
            <div id="app">
                <App {...state}></App>
            </div>
        </body>
    </html>
);

const PageStream = () => {
    const sheet = new ServerStyleSheet()
    const jsx = sheet.collectStyles(HTML(state));
    return sheet.interleaveWithNodeStream(ReactDOM.renderToNodeStream(jsx))
}

export const Serve: koa.Middleware = context => {
    context.response.set("Content-Type", "text/html; charset=utf-8");
    context.body = PageStream();
    return;
};
