/**
 * Class TodoLine
 */
module.exports = class TodoLine {
    constructor(lineData) {
        this.id = lineData.id;
        this.todoListId = lineData.todoListId;
        this.name = lineData.name;
        this.isDone = lineData.isDone;
        this.createdAt = lineData.createdAt;
        this.updatedAt = lineData.updatedAt;
        this.limitDate = lineData.limitDate;
    }
}