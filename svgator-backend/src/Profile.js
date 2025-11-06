class Profile {
    constructor(inst){
        this.inst = inst;
    };

    async get(access_token, customer_id){
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

        return await this.inst.backend.get('/profile', args);
    }
}

module.exports = Profile;
