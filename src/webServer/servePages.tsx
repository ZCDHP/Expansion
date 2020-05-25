import koa from 'koa';
import React from "react";
import ReactDOM from "react-dom/server";
import { ServerStyleSheet } from 'styled-components';

import { Void } from '../infrastructure/utils';


import { Files as Bundles } from "../building/bundles";
const Manifest: { [key in Bundles]: string } = require("../www/manifest.json");

import InitialState from './initialState';
import { AppView } from '../client/components/appView'

import { State as ViewState } from "../client/state";
import { State as LoginState } from "../client/state.login";

const state: ViewState = {
    login: LoginState.LoggedOut(),
};

const HTML = (state: ViewState) => (
    <html>
        <head>
            <title>Expansion</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Expansion - The Card Game" />
            <InitialState {...state} />
            <script src={`/${Manifest[Bundles.vendor]}`}></script>
            <script src={`/${Manifest[Bundles.app]}`}></script>
        </head>
        <body>
            <div id="app">
                <AppView state={state} issueCommand={Void} ></AppView>
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
