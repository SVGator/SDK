const Backend = require("./src/Backend");
const Token = require("./src/Token");
const Projects = require("./src/Projects");
const Renders = require("./src/Renders");

const DEFAULT_ENDPOINT = 'https://app.svgator.com';
const CLASSIC_API = '/api/app-auth';
const OAUTH_API = '/api/svgator/oauth';

const defaultOptions = {
    'endpoint': DEFAULT_ENDPOINT + CLASSIC_API,
};

function filterEndpoint(endpoint){
    return !endpoint ? DEFAULT_ENDPOINT : endpoint.replace(/\/+$/, '');
}

class SVGatorBackend {
    constructor(options){
        if (!options) {
            throw new Error("Options are missing");
        }
        if (!options.app_id) {
            throw new Error("options.app_id is missing");
        }

        this.options = {...defaultOptions, ...options};

        this.backend = new Backend(this.options);
        this.token = new Token(this);
        this.projects = new Projects(this);
        this.renders = new Renders(this);
    };

    static async getOauth(appId, endpoint) {
        endpoint = filterEndpoint(endpoint);
        let url = endpoint + OAUTH_API
            + '?action=create&appId=' + encodeURIComponent(appId)
        const json = await Backend.request(url);
        return {
            url: endpoint + '/app-auth/connect?appId=' + encodeURIComponent(appId || 'dynamic') + '&oauth_writer=' + encodeURIComponent(json?.oauth?.writer),
            id: json?.oauth?.id,
            response: json,
        };
    }

    static async waitOauth(appId, endpoint, oauth_id, timeout) {
        endpoint = filterEndpoint(endpoint);

        const startTime = new Date().getTime();
        let lastResponse = null;
        do {
            const elapsedTime = (new Date().getTime() - startTime) / 1000;
            const leftTime = Math.max(0, Math.round(timeout - elapsedTime));
            let url = endpoint + OAUTH_API + '?action=read' + '&oauthId=' + encodeURIComponent(oauth_id);
            if (appId) {
                url += '&appId=' + encodeURIComponent(appId);
            }
            if (leftTime > 0) {
                url += '&timeout=' + leftTime;
            }
            try {
                lastResponse = await Backend.request(url);
            } catch(e) {}
        } while (
            new Date().getTime() - startTime < timeout * 1000
            && lastResponse?.status === 'pending'
            );
        const result = {
            status: lastResponse?.status || 'error',
        }
        if (lastResponse?.status === 'completed') {
            const token = lastResponse?.token || {};
            result.token = {...token};
            result.backend = new SVGatorBackend({
                app_id: token.app_id,
                endpoint: endpoint + CLASSIC_API,
                secret_key: token.secret_key,
            });
        }
        return result;
    }

    changeSecretKey(secretKey) {
        this.options.secret_key = secretKey;
    }
}

module.exports = SVGatorBackend;
