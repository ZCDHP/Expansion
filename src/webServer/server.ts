require('source-map-support').install();

import path from 'path';
import koa from 'koa';
import koa_static from 'koa-static';

import { Config as WebServerConfig } from '../config/webServer';

import { Serve as ServePages } from "./servePages";


async function main() {
    const app = new koa();
    const www = path.join(__dirname, "../www");
    app.use(koa_static(www));

    app.use(ServePages);

    app.listen(WebServerConfig.server.port);
}

main();
