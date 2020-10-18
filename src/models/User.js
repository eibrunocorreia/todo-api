const bcrypt = require('bcrypt');

const saltRounds = 10

/**
 * Class User
 */
module.exports = class User {
    constructor(userData) {
        this.id = userData.id;
        this.password = userData.password;
        this.createdAt = userData.createdAt;
        this.updatedAt = userData.updatedAt;
        this.email = userData.email;
    }

    /**
     * @description function that encrypts the password and returns the resulting hash  
     */
    setPassword() {
        return bcrypt.hashSync(`${this.email}${this.password}`, saltRounds);
    }
}