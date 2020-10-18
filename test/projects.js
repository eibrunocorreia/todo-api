require('dotenv').config();
process.env.ENV = 'test'
const assert = require('assert');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const { createNewUser, deleteUser } = require('../src/service/user');
const { createProject, getProject, updateProject, getAllUserProjects, deleteProject } = require('../src/service/projects');
const { startServer } = require('../index');
const axios = require('axios');


const testUser = new User({
    email: "test2@gmail.com",
    password: "teste"
});

const testProject1 = new Project({
    name: "ProjectDemo1"
})

const testProject2 = new Project({
    name: "ProjectDemo2"
})

describe('Projects Test', async function () {

    it('Check if can create 2 new Projects in the system (Function)', async function () {
        testUser.id = await createNewUser(testUser);
        testProject1.id = await createProject(testUser, testProject1);
        testProject2.id = await createProject(testUser, testProject2);
        let savedProject1 = await getProject(testUser, testProject1);
        let savedProject2 = await getProject(testUser, testProject2);
        let testResult1 = savedProject1.name === testProject1.name && savedProject1.id === testProject1.id
        let testResult2 = savedProject2.name === testProject2.name && savedProject2.id === testProject2.id
        assert.strictEqual((testResult1 && testResult2), true);
    });

    it('Check if can recover all user projects (Function)', async function () {
        let projects = await getAllUserProjects(testUser);
        let testResult = projects.length === 2;
        projects.forEach(project => {
            if (![testProject1.name, testProject2.name].includes(project.name)) {
                testResult = false;
            }
        });
        assert.strictEqual(testResult, true);
    });

    it('Check if can update one Projects in the system (Function)', async function () {
        let newName = 'UpdatedProject';
        testProject1.name = newName;
        await updateProject(testUser, testProject1);
        let savedProject1 = await getProject(testUser, testProject1);
        let testResult1 = savedProject1.name === newName
        assert.strictEqual(testResult1, true);
    });

    it('Check if can delete all user Projects in the system one by one (Function)', async function () {
        await deleteProject(testUser, testProject1);
        await deleteProject(testUser, testProject2);
        let projects = await getAllUserProjects(testUser);
        assert.strictEqual(projects.length, 0);
        await deleteUser(testUser);
    });

    it('Check if can create 2 new Projects in the system (API)', async function () {
        testUser.id = await createNewUser(testUser);
        testProject1.id = await axios.post(`http://localhost:${process.env.API_PORT}/todoapi/proj/create`, {
            email: testUser.email,
            password: testUser.password,
            userid: testUser.id,
            projectname: testProject1.name
        }, { headers: { apiSecret: process.env.API_SECRET } })
            .then((response) => response.data.message);
        testProject2.id = await axios.post(`http://localhost:${process.env.API_PORT}/todoapi/proj/create`, {
            email: testUser.email,
            password: testUser.password,
            userid: testUser.id,
            projectname: testProject2.name
        }, { headers: { apiSecret: process.env.API_SECRET } })
            .then((response) => response.data.message);
        let savedProject1 = await getProject(testUser, testProject1);
        let savedProject2 = await getProject(testUser, testProject2);
        let testResult1 = savedProject1.name === testProject1.name && savedProject1.id === testProject1.id
        let testResult2 = savedProject2.name === testProject2.name && savedProject2.id === testProject2.id
        assert.strictEqual((testResult1 && testResult2), true);
    });

    it('Check if can recover all user projects (API)', async function () {
        let projects = await axios.post(`http://localhost:${process.env.API_PORT}/todoapi/proj/all`, {
            email: testUser.email,
            password: testUser.password,
            userid: testUser.id,
        }, { headers: { apiSecret: process.env.API_SECRET } })
            .then((response) => response.data.message);
        let testResult = projects.length === 2;
        projects.forEach(project => {
            if (![testProject1.name, testProject2.name].includes(project.name)) {
                testResult = false;
            }
        });
        assert.strictEqual(testResult, true);
    });

    it('Check if can update one Projects in the system (API)', async function () {
        let newName = 'UpdatedProject';
        testProject1.name = newName;
        await axios.post(`http://localhost:${process.env.API_PORT}/todoapi/proj/update`, {
            email: testUser.email,
            password: testUser.password,
            userid: testUser.id,
            projectid: testProject1.id,
            newname: newName
        }, { headers: { apiSecret: process.env.API_SECRET } })
        let savedProject1 = await getProject(testUser, testProject1);
        let testResult1 = savedProject1.name === newName
        assert.strictEqual(testResult1, true);
    });

    it('Check if can delete all user Projects in the system one by one (Function)', async function () {
        await axios.post(`http://localhost:${process.env.API_PORT}/todoapi/proj/del`, {
            email: testUser.email,
            password: testUser.password,
            userid: testUser.id,
            projectid: testProject1.id
        }, { headers: { apiSecret: process.env.API_SECRET } });
        await axios.post(`http://localhost:${process.env.API_PORT}/todoapi/proj/del`, {
            email: testUser.email,
            password: testUser.password,
            userid: testUser.id,
            projectid: testProject2.id
        }, { headers: { apiSecret: process.env.API_SECRET } });
        let projects = await getAllUserProjects(testUser);
        assert.strictEqual(projects.length, 0);
        await deleteUser(testUser);
    });


});