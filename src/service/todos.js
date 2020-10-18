const { checkUserCredentials } = require('./user');
const databaseConnection = require('../connector/dataBase');
const projects = require('./projects');

const PROJECT_TABLES = 'projects';
const TODO_LIST_TABLE = 'todo_lists';
const TODO_LIST_LINE_TABLE = 'todo_lines';

async function createList(user, project, list) {
    if (await checkUserCredentials(user)) {
        return databaseConnection(TODO_LIST_TABLE)
            .insert({
                name: list.name,
                description: list.description,
                created_at: new Date(),
                updated_at: new Date(),
                project_id: project.id
            }).then((response) => response[0])
    }
}

async function getList(user, list) {
    if (await checkUserCredentials(user)) {
        let listData = await databaseConnection(TODO_LIST_TABLE)
            .where({ id: list.id })
            .then((result) => result[0]);
        if (listData) {
            listData.lines = await databaseConnection(TODO_LIST_LINE_TABLE)
                .where({ todo_list_id: list.id })
        }
        return listData ? listData : {}
    }
}

async function deleteList(user, list) {
    if (await checkUserCredentials(user)) {
        // delete lines
        await databaseConnection(TODO_LIST_LINE_TABLE)
            .where({ todo_list_id: list.id })
            .del()
        // delete list
        await databaseConnection(TODO_LIST_TABLE)
            .where({ id: list.id })
            .del()
    }
}

async function getProjectLists(user, project) {
    if (await checkUserCredentials(user)) {
        return await databaseConnection(TODO_LIST_TABLE)
            .where({ project_id: project.id })
    }
}

async function addLine(user, project, list, line) {
    if (await checkUserCredentials(user)) {
        return databaseConnection(TODO_LIST_LINE_TABLE)
            .insert({
                is_done: line.isDone,
                name: line.name,
                created_at: new Date(),
                updated_at: new Date(),
                limit_date: line.limitDate,
                todo_list_id: list.id,
                project_id: project.id
            }).then((response) => response[0])
    }
}

module.exports = {
    createList,
    getList,
    deleteList,
    getProjectLists,
    addLine
}