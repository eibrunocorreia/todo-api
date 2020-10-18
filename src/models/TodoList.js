/**
 * Class TodoList
 */
module.exports = class TodoList {
    constructor(listData) {
        this.id = listData.id;
        this.projectId = listData.projectId;
        this.name = listData.name;
        this.description = listData.description;
        this.createdAt = listData.createdAt;
        this.updatedAt = listData.updatedAt;
    }
}