/**
 * Class Project
 */
module.exports = class Project {
    constructor(projectData) {
        this.userId = projectData.userId;
        this.id = projectData.id;
        this.name = projectData.name;
        this.createdAt = projectData.createdAt;
        this.updatedAt = projectData.updatedAt;
    }
}