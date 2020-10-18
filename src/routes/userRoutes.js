const Router = require('koa-router');
const User = require('../models/User');
const { createNewUser, login } = require('../service/user');

const router = new Router({ prefix: "/users" });

/**
 * Route that logs a user
 * @returns id of new user
 * @argument password
 * @argument email
 */
router.post('/register', async (ctx) => {
    try {
        const { request } = ctx;
        const { password, email } = request.body;

        let user = new User({
            password,
            email
        });

        ctx.body = { message: await createNewUser(user) }
    } catch (error) {
        ctx.body = { message: error }
    }
});

/**
 * Route to login
 * @returns user data
 * @argument password
 * @argument email
 */
router.post('/login', async (ctx) => {
    try {
        const { request } = ctx;
        const { password, email } = request.body;

        let user = new User({
            password,
            email
        });

        let loginData = await login(user);

        if (loginData.email ? loginData.email === user.email : false) {
            ctx.body = { message: loginData };
        } else {
            ctx.body = { message: 'Invalid username or password' };
        }
    } catch (error) {
        ctx.body = { message: error };
    }
});

module.exports = router;