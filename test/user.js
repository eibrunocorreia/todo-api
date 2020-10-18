require('dotenv').config();
const assert = require('assert');
const User = require('../src/models/User');
const axios = require('axios');
const databaseConnection = require('../src/connector/dataBase');
const { createNewUser, deleteUser, login, getUserByEmail } = require('../src/service/user');

const testUser = new User({
    email: "test@gmail.com",
    password: "teste"
});

describe('Users Test', async function () {

    it('Check if you can create one used in the system (Function)', async function () {
        let response = await createNewUser(testUser);
        let result = await getUserByEmail(testUser.email);
        assert.strictEqual(testUser.email, result.email);
    });

    it("Check if you don't create a new entry if the user already exists (Function)", async function () {
        let response = await createNewUser(testUser);
        let userCount = await databaseConnection('users')
            .count('id as total')
            .where({ email: testUser.email })
            .then((result) => result[0].total)
            .catch(() => 0)
        assert.strictEqual(userCount, 1);
    });

    it('Check the Login System (Function)', async function () {
        let response = await login(testUser);
        let result = response.email ? response.email === testUser.email : false;
        assert.strictEqual(result, true);
        await deleteUser(testUser);
    });

    it('Check if you can create one used in the system (API)', async function () {
        await axios.post(`http://localhost:${process.env.API_PORT}/todoapi/users/register`, {
            email: testUser.email,
            password: testUser.password
        }, { headers: { apiSecret: process.env.API_SECRET } });
        let result = await getUserByEmail(testUser.email);
        assert.strictEqual(testUser.email, result.email);
    });

    it("check if you don't create a new entry if the user already exists (API)", async function () {
        await axios.post(`http://localhost:${process.env.API_PORT}/todoapi/users/register`, {
            email: testUser.email,
            password: testUser.password
        }, { headers: { apiSecret: process.env.API_SECRET } });
        let userCount = await databaseConnection('users')
            .count('id as total')
            .where({ email: testUser.email })
            .then((result) => result[0].total)
            .catch(() => 0)
        assert.strictEqual(userCount, 1);
    });

    it('Check the Login System (API)', async function () {
        let response = await axios.post(`http://localhost:${process.env.API_PORT}/todoapi/users/login`, {
            email: testUser.email,
            password: testUser.password
        }, { headers: { apiSecret: process.env.API_SECRET } })
            .then((response) => response.data.message);
        let result = response.email ? response.email === testUser.email : false;
        assert.strictEqual(result, true);
        await deleteUser(testUser);
    });

});