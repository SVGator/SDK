class Assets {
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

        return await this.inst.backend.get('/assets', args);
    }

    async get(access_token, asset_id){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!asset_id) {
            throw new Error("asset_id is missing");
        }

        return await this.inst.backend.get('/asset', {access_token, asset_id});
    }

    /**
     * Create a new asset or replace an existing asset's JSON.
     * `asset` is the full asset body (`{ title?, document, definitions? }`) —
     * `title` rides inside the body and `options` is always persisted as null.
     * Omit `asset_id` to **create** a new asset owned by the token's customer;
     * pass it (prefixed `as_`, same as the GET call) to **replace** that asset's
     * whole JSON.
     */
    async save(access_token, asset, asset_id){
        if (!this.inst.options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        if (!access_token) {
            throw new Error("access_token is missing");
        }

        if (!asset || typeof asset !== 'object') {
            throw new Error("asset is missing or not an object");
        }

        let args = {access_token};

        if (asset_id) {
            args.asset_id = asset_id;
        }

        return await this.inst.backend.post('/asset', args, asset);
    }
}

module.exports = Assets;
