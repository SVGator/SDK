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

    /**
     * Create a new project or replace an existing project's JSON.
     * `project` is the full project body (`{ title?, folder?, document,
     * definitions?, options? }`) — `title` and `folder` ride inside the body.
     * `folder` is a folder id (`fd_…`, sibling of `title`) placing the project in
     * that folder: omit to leave it unchanged (kept on replace, none on create),
     * pass `""`/`null` to clear it, or a valid id to assign it. Omit `project_id`
     * to **create** a new project owned by the token's customer; pass it (prefixed
     * `pi_`, same as the GET calls) to **replace** that project's whole JSON.
     */
    async save(access_token, project, project_id){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project || typeof project !== 'object') {
            throw new Error("project is missing or not an object");
        }

        let args = {access_token};

        if (project_id) {
            args.project_id = project_id;
        }

        return await this.inst.backend.post('/project', args, project);
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

    /**
     * Duplicate or move a project in a single call.
     * `body` is the organize body — `action` (`"duplicate"` | `"move"`, required)
     * selects the operation; `folder` (a `fd_…` id, optional) and `title`
     * (optional) ride inside it. For **duplicate**: `title` names the copy
     * (defaults to the source title) and `folder` places it (omit to reuse the
     * source folder, pass `""`/`null` for none). For **move**: `title` renames
     * the project and `folder` relocates it (omit either to leave it unchanged);
     * moving into the current folder with no rename is rejected. When neither
     * `folder` nor `title` is set, still pass the `action` in the body.
     */
    async organize(access_token, project_id, body){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!project_id) {
            throw new Error("project_id is missing");
        }

        if (!body || typeof body !== 'object') {
            throw new Error("body is missing or not an object");
        }

        return await this.inst.backend.post('/organize', {access_token, project_id}, body);
    }
}

module.exports = Projects;
