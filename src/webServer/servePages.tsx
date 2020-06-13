import koa from 'koa';
import React from "react";
import ReactDOM from "react-dom/server";
import { ServerStyleSheet } from 'styled-components';

import { Files as Bundles } from "../building/bundles";
const Manifest: { [key in Bundles]: string } = require("../www/manifest.json");

import InitialState from './initialState';
import { AppView } from '../client/components/appView'

import { State as ViewState } from "../client/domain/domain";


const HTML = (state: ViewState) => (
    <html>
        <head>
            <title>Expansion</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Expansion - The Card Game" />
            <InitialState {...state} />
            <script async src={`/${Manifest[Bundles.vendor]}`}></script>
            <script async src={`/${Manifest[Bundles.app]}`}></script>
        </head>
        <body>
            <div id="app">
                <AppView state={ViewState.Initial} issueCommand={_ => { }}></AppView>
            </div>
        </body>
    </html>
);

const PageStream = () => {
    const sheet = new ServerStyleSheet()
    const jsx = sheet.collectStyles(HTML(ViewState.Initial));
    return sheet.interleaveWithNodeStream(ReactDOM.renderToNodeStream(jsx))
}

export const Serve: koa.Middleware = context => {
    context.response.set("Content-Type", "text/html; charset=utf-8");
    context.body = PageStream();
    return;
};
