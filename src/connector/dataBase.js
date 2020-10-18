const knex = require('knex');

const dbSettings = {
    host: process.env.DB_HOST,
    database: process.env.DB_SCHEMA,
    user: process.env.DB_U,
    password: process.env.DB_P,
    port: process.env.DB_PORT
};

const databaseConnection = new knex({
    client: "mysql",
    connection: dbSettings
});

module.exports = databaseConnection;
