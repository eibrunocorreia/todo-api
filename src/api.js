const Router = require('koa-router');
const usersRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const todoRoutes = require('./routes/todoRoutes');

const defaultRouter = new Router({ prefix: '/todoapi' });

const apiSecret = process.env.API_SECRET;

defaultRouter.get('/status', async (ctx) => {
    ctx.body = { "status": "OK" }
});

defaultRouter.use((ctx, next) => {
    const { request } = ctx;
    const { apisecret } = request.headers;
    if (apisecret && apisecret === apiSecret) {
        const start = Date.now();
        return next().then(() => {
            const ms = Date.now() - start;
            if(process.env.ENV !== 'test'){
                console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
            }
        });
    }
    ctx.throw(499, 'access deny');
});

defaultRouter.use(usersRoutes.routes());
defaultRouter.use(usersRoutes.allowedMethods());

defaultRouter.use(projectRoutes.routes());
defaultRouter.use(projectRoutes.allowedMethods());

defaultRouter.use(todoRoutes.routes());
defaultRouter.use(todoRoutes.allowedMethods());

module.exports = defaultRouter;