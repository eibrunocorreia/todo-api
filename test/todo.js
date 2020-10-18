require('dotenv').config();
process.env.ENV = 'test'
const assert = require('assert');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const TodoList = require('../src/models/TodoList')
const TodoLine = require('../src/models/TodoLine')
const databaseConnection = require('../src/connector/dataBase');
const { createNewUser, deleteUser } = require('../src/service/user');
const { createProject, deleteProject } = require('../src/service/projects');
const { createList, getList, deleteList, getProjectLists,addLine } = require('../src/service/todos');
const axios = require('axios');

const testUser = new User({
    email: "test@gmail.com",
    password: "teste"
});

const testProject = new Project({
    name: "ProjectDemo"
})

const testList = new TodoList({
    name: "demo",
    description: "demo"
});

const testList2 = new TodoList({
    name: "demo2",
    description: "demo2"
});

const testListLine1 = new TodoLine({
    name: "demo2",
    isDone: 0,
    limitDate: new Date()
});

const testListLine2 = new TodoLine({
    name: "demo2",
    isDone: 0,
    limitDate: new Date()
});

describe('Todo Test', async function () {

    it('Check if you can create one todo list in the system (Function)', async function () {
        testUser.id = await createNewUser(testUser);
        testProject.id = await createProject(testUser, testProject);
        testList.id = await createList(testUser, testProject, testList);
        let savedlist = await getList(testUser, testList);
        let testResult = savedlist.name === testList.name && savedlist.description === testList.description
        assert.strictEqual(testResult, true);
    });

    it('Check if you can get all todo list of a project (Function)', async function () {
        testList2.id = await createList(testUser, testProject, testList2);
        let savedlist = await getProjectLists(testUser, testProject);
        assert.strictEqual(savedlist.length, 2);
    });

    it('Check if you can add lines to a todo list (Function)', async function () {
        testListLine1.id = await addLine(testUser,testProject,testList,testListLine1);        
        testListLine2.id = await addLine(testUser,testProject,testList,testListLine2);        
        let lines = await databaseConnection('todo_lines')
        .count('id as total')
        .where({ todo_list_id: testList.id })
        .then((result) => result[0].total)
        .catch(() => 0)
        assert.strictEqual(lines, 2);
    });


    it('Check if you can delete one todo list in the system (Function)', async function () {
        await deleteList(testUser, testList);
        await deleteList(testUser, testList2);
        let list = await databaseConnection('todo_lists')
            .count('id as total')
            .where({ project_id: testProject.id })
            .then((result) => result[0].total)
            .catch(() => 10)
        assert.strictEqual(list, 0);
        await deleteProject(testUser, testProject);
        await deleteUser(testUser);
    });

});