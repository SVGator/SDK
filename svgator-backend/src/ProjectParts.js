class ProjectParts {
    constructor(inst){
        this.inst = inst;
    };

    async get(access_token, project_id, options){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project_id) {
            throw new Error("project_id is missing");
        }

        let args = {access_token, project_id};

        if (options) {
            if (options.depth !== undefined && options.depth !== null) {
                args.depth = options.depth;
            }
            if (options.item) {
                args.item = options.item;
            }
            if (options.fields) {
                args.fields = options.fields;
            }
        }

        return await this.inst.backend.get('/project-part', args);
    }
}

module.exports = ProjectParts;
