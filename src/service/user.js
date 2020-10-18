const databaseConnection = require('../connector/dataBase');
const bcrypt = require('bcrypt');

const USER_TABLE = 'users'

async function createNewUser(user) {
    let userd = await getUserByEmail(user.email);
    if (!userd.email) {
        let passwordHash = user.setPassword();
        let id = await databaseConnection(USER_TABLE)
            .insert({
                password: passwordHash,
                email: user.email,
                created_at: new Date(),
                updated_at: new Date()
            }).then((result) => result[0])
            .catch(() => -1);
        return id > -1 ? id : 'Error creating the user';
    }
    return `the email ${user.email} has already been registered`
}

async function deleteUser(user) {
    try {
        await databaseConnection(USER_TABLE)
            .where({ email: user.email })
            .del()
        return true;
    } catch (errorMessage) {
        return false;
    }
}

async function getUserByEmail(email) {
    return databaseConnection(USER_TABLE)
        .where({ email })
        .then((users) => users[0] ? users[0] : {})
        .catch((errorMessage) => {
            console.error(errorMessage);
            return {};
        })
}

async function checkUserCredentials(user) {
    try {
        let databaseHash = await databaseConnection(USER_TABLE)
            .select('password')
            .where({ email: user.email })
            .then((result) => result[0] ? result[0].password : "");
        return bcrypt.compare(`${user.email}${user.password}`, databaseHash);
    } catch (errorMessage) {
        console.error(errorMessage)
        return false;
    }

}

async function login(user) {
    if (await checkUserCredentials(user)) {
        return getUserByEmail(user.email);
    }
    return {};
}

module.exports = {
    createNewUser,
    deleteUser,
    checkUserCredentials,
    getUserByEmail,
    login
}