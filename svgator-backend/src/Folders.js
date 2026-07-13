class Folders {
    constructor(inst){
        this.inst = inst;
    };

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

        return await this.inst.backend.get('/folders', args);
    }

    async get(access_token, folder_id){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!folder_id) {
            throw new Error("folder_id is missing");
        }

        return await this.inst.backend.get('/folder', {access_token, folder_id});
    }

    /**
     * Create a new folder or rename an existing one.
     * `folder` is the folder body — only `title` (required, non-empty) is
     * editable through this endpoint. Omit `folder_id` to **create** a new
     * folder owned by the token's customer; pass it (prefixed `fd_`, same as the
     * GET call) to **rename** that folder.
     */
    async save(access_token, folder, folder_id){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!folder || typeof folder !== 'object') {
            throw new Error("folder is missing or not an object");
        }

        let args = {access_token};

        if (folder_id) {
            args.folder_id = folder_id;
        }

        return await this.inst.backend.post('/folder', args, folder);
    }
}

module.exports = Folders;
