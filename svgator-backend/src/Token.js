class Token {
    constructor(inst){
        this.inst = inst;
    };

    async get(auth_code){
        if (!auth_code) {
            throw new Error("auth_code is missing");
        }

        return await this.inst.backend.get('/token', {auth_code});
    }
}

module.exports = Token;