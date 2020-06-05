require('source-map-support').install();

import path from 'path';
import koa from 'koa';
import koa_static from 'koa-static';
import koa_ws from 'koa-websocket';

import { WebConfig } from '../config/webServer';

import { Serve as ServePages } from "./servePages";
import { HandleConnection } from "./server.connection";


async function main() {
    const config = WebConfig;
    console.log(JSON.stringify(config));

    const app = koa_ws(new koa());
    const www = path.join(__dirname, "../www");
    app.use(koa_static(www));

    app.use(ServePages);

    app.ws.use(HandleConnection(config));

    app.listen(config.server.port);
}

main();
