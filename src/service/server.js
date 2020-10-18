function startServer() {
    const koa = require('koa');
    const koaBody = require('koa-body');
    const app = new koa();
    const api = require('../api');

    const serverPort = process.env.API_PORT || 3002;

    app.use(koaBody());
    app.use(api.routes());
    app.use(api.allowedMethods());

    app.listen(serverPort, () => {
        console.log(`The server is running into port ${serverPort}`);
    });
}

module.exports = { startServer };