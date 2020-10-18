const { checkUserCredentials } = require('./user');
const databaseConnection = require('../connector/dataBase');

const PROJECT_TABLES = 'projects';
const TODO_LIST_TABLE = 'todo_lists';
const TODO_LIST_LINE_TABLE = 'todo_lists';

/**
 * function used to create a new project
 * @param {User} user user who will create the project 
 * @param {Project} project Details of the project to be created
 */
async function createProject(user, project) {
    if (await checkUserCredentials(user)) {
        let id = await databaseConnection(PROJECT_TABLES)
            .insert({
                name: project.name,
                created_at: new Date(),
                updated_at: new Date(),
                user_id: user.id
            }).then((response) => response[0])
        return id > -1 ? id : false
    }
    return false
}

/**
 * function that returns the details of one project
 * @param {User} user user who holds the project 
 * @param {Project} project Details of the project to be created
 */
async function getProject(user, project) {
    if (await checkUserCredentials(user)) {
        let projectDetail = await databaseConnection(PROJECT_TABLES)
            .where({
                user_id: user.id,
                id: project.id
            })
            .then((result) => result[0]);
        // get lists
        if(projectDetail){
            projectDetail.lists = await databaseConnection(TODO_LIST_TABLE)
            .where({
                project_id: project.id
            });
        }
        return projectDetail ? projectDetail : false
    }
    return false
}

/**
 * function that returns the details of one project
 * @param {User} user user who holds the project 
 */
async function getAllUserProjects(user) {
    if (await checkUserCredentials(user)) {
        return databaseConnection(PROJECT_TABLES)
            .where({
                user_id: user.id
            });
    }
}


/**
 * function to delete one project
 * @param {User} user user who holds the project 
 * @param {Project} project project to delete
 */
async function deleteProject(user, project) {
    if (await checkUserCredentials(user)) {
        // delete all lines
        await databaseConnection(TODO_LIST_LINE_TABLE)
            .where({ project_id: project.id })
            .del()
        // delete all lists
        await databaseConnection(TODO_LIST_TABLE)
            .where({ project_id: project.id })
            .del()
        // delete Project
        await databaseConnection(PROJECT_TABLES)
            .where({ id: project.id })
            .del()
        return true;
    }
    return false
}

/**
 * function used to update a project data
 * @param {User} user user who holds the project 
 * @param {Project} project Details of the project to be updates 
 */
async function updateProject(user, project) {
    if (await checkUserCredentials(user)) {
        await databaseConnection(PROJECT_TABLES)
            .update({
                name: project.name,
                updated_at: new Date()
            })
            .where({ id: project.id });
        return true;
    }
    return false;
}

module.exports = {
    createProject,
    getProject,
    deleteProject,
    getAllUserProjects,
    updateProject
}