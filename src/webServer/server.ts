require('source-map-support').install();

import path from 'path';
import koa from 'koa';
import koa_static from 'koa-static';

import { Config as WebServerConfig } from '../config/webServer';


async function main() {
    const app = new koa();
    const www = path.join(__dirname, "../www");
    app.use(koa_static(www));

    app.use(context => {
        context.response.set("Content-Type", "text/html; charset=utf-8");
        context.body = "Hello World";
    });

    app.listen(WebServerConfig.server.port);
}

main();
