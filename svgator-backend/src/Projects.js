class Token {
    constructor(inst){
        this.inst = inst;
    };

    async export(access_token, project_id)
    {
        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project_id) {
            throw new Error("project_id is missing");
        }

        return await this.inst.backend.get('/export', {access_token, project_id}, true);
    }

    async getAll(access_token, customer_id, limit, offset){
        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!customer_id) {
            throw new Error("customer_id is missing");
        }

        let args = {access_token, customer_id};

        if (limit) {
            args.limit = limit;
            if (offset) {
                args.offset = offset;
            }
        }

        return await this.inst.backend.get('/projects', args);
    }

    async get(access_token, project_id){
        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project_id) {
            throw new Error("project_id is missing");
        }

        return await this.inst.backend.get('/project', {access_token, project_id});
    }
}

module.exports = Token;