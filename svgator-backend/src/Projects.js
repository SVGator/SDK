class Projects {
    constructor(inst){
        this.inst = inst;
    };

    async customExport(access_token, project_id, options)
    {
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project_id) {
            throw new Error("project_id is missing");
        }

        return await this.inst.backend.post('/export', {access_token, project_id}, options);
    }
    
    async export(access_token, project_id)
    {
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project_id) {
            throw new Error("project_id is missing");
        }

        return await this.inst.backend.get('/export', {access_token, project_id}, true);
    }

    async getAll(access_token, customer_id, limit, offset, filter){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!customer_id) {
            throw new Error("customer_id is missing");
        }

        let args = {access_token, customer_id};

        if (filter) {
            args.filter = filter;
        }

        if (limit) {
            args.limit = limit;
            if (offset) {
                args.offset = offset;
            }
        }

        return await this.inst.backend.get('/projects', args);
    }

    async get(access_token, project_id){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project_id) {
            throw new Error("project_id is missing");
        }

        return await this.inst.backend.get('/project', {access_token, project_id});
    }

    async skeleton(access_token, project_id, options){
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

        return await this.inst.backend.get('/skeleton', args);
    }

    async getProjectParts(access_token, project_id, options){
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
        }

        return await this.inst.backend.get('/project-parts', args);
    }
}

module.exports = Projects;
