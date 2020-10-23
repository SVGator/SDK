const Backend = require("./src/Backend");
const Token = require("./src/Token");
const Projects = require("./src/Projects");

const defaultOptions = {
    'endpoint': 'https://app.svgator.com/api/app-auth',
};


class SVGatorBackend {
    constructor(options){
        if (!options) {
            throw new Error("Options are missing");
        }
        if (!options.app_id) {
            throw new Error("options.app_id is missing");
        }
        if (!options.secret_key) {
            throw new Error("options.secret_key is missing");
        }

        this.options = {...defaultOptions, ...options};

        this.backend = new Backend(this.options);
        this.token = new Token(this);
        this.projects = new Projects(this);
    };
}

module.exports = SVGatorBackend;