class Renders {
    constructor(inst) {
        this.inst = inst;
    };

    async getAll(access_token, customer_id, limit, offset, filter) {
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

        return await this.inst.backend.get('/renders', args);
    }

    async get(access_token, render_id) {
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!render_id) {
            throw new Error("render_id is missing");
        }

        return await this.inst.backend.get('/render', {access_token, render_id});
    }
}

module.exports = Renders;
