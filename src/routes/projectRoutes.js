const Router = require('koa-router');
const User = require('../models/User');
const Project = require('../models/Project');

const { checkUserCredentials } = require('../service/user');
const { createProject, getAllUserProjects, getProject, updateProject, deleteProject } = require('../service/projects');

const router = new Router({ prefix: "/proj" });

router.post('/create', async (ctx) => {
    try {
        const { request } = ctx;
        const { email, password, projectname, userid } = request.body;

        let user = new User({ email, password, id: userid });
        let project = new Project({ name: projectname });

        let message = 'error creating the project';

        if (await checkUserCredentials(user)) {
            let id = await createProject(user, project);
            if (id) {
                message = id
            }
        }
        ctx.body = { message: message }

    } catch (error) {
        ctx.body = { message: error }
    }
});

router.post('/all', async (ctx) => {
    try {
        const { request } = ctx;
        const { email, password, userid } = request.body;

        let user = new User({ email, password, id: userid });

        let message = 'error getting the project';

        if (await checkUserCredentials(user)) {
            let projects = await getAllUserProjects(user);
            if (projects) {
                message = projects
            }
        }
        ctx.body = { message: message }

    } catch (error) {
        ctx.body = { message: error }
    }
});

router.post('/project', async (ctx) => {
    try {
        const { request } = ctx;
        const { email, password, userid, projectid } = request.body;

        let user = new User({ email, password, id: userid });
        let project = new Project({ id: projectid });

        let message = 'error getting the projects';

        if (await checkUserCredentials(user)) {
            message = await getProject(user, project);
        }

        ctx.body = { message: message }

    } catch (error) {
        ctx.body = { message: error }
    }
});

router.post('/update', async (ctx) => {
    try {
        const { request } = ctx;
        const { email, password, userid, projectid, newname } = request.body;
        let user = new User({ email, password, id: userid });
        let project = new Project({ id: projectid, name: newname });

        let message = 'error updating the project';

        if (await checkUserCredentials(user)) {
            await updateProject(user, project);
            message = project;
        }
        ctx.body = { message: message }

    } catch (error) {
        ctx.body = { message: error }
    }
});

router.post('/del', async (ctx) => {
    try {
        const { request } = ctx;
        const { email, password, userid, projectid } = request.body;

        let user = new User({ email, password, id: userid });
        let project = new Project({ id: projectid });

        let message = 'error deleting the project';

        if (await checkUserCredentials(user)) {
            message = await deleteProject(user, project);
        }

        ctx.body = { message: message }

    } catch (error) {
        ctx.body = { message: error }
    }
});

module.exports = router;