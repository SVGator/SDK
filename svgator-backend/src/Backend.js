const crypto = require('crypto');

/**
 * @author Tibor Vincze
 * @date 10/13/2020 5:00 PM
 */

class Backend {
    static requester = null;
    constructor(options){
        if (!options) {
            throw new Error("Options are missing");
        }
        if (!options.app_id) {
            throw new Error("options.app_id is missing");
        }

        this.options = {...options};
    };

    // Cross-platform SHA-256
    static async _sha256Hex(input) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(input);

            const hashBuffer = await crypto.subtle.digest("SHA-256", data);

            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        } catch(e) {
            return crypto.createHash("sha256").update(input).digest("hex");
        }
    }

    async addHash(params){
        params.hash = Object.keys(params).sort().reduce((acc, curr) => {
            return acc + params[curr];
        }, '');

        params.hash += this.options.secret_key || '';
        params.hash = await Backend._sha256Hex(params.hash);
    }

    async queryString(params) {
        if (!params) {
            throw new Error("Invalid entity to read");
        }
        params.app_id = this.options.app_id;
        params.time = Math.round(Date.now() / 1000);

        for (let key in params) {
            if (typeof params[key] === 'object') {
                params[key] = JSON.stringify(params[key]);
            }
        }

        await this.addHash(params);
        return Object.keys(params).reduce((acc, curr) => {
            return acc + (acc ? '&' : '?') + encodeURIComponent(curr) + '=' + encodeURIComponent(params[curr]);
        }, '');
    }

    async get(path, params, returnRaw){
        if (!path) {
            throw new Error("Invalid entity to read");
        }

        let url = this.options.endpoint + path + await this.queryString(params);

        return await Backend.request(url, returnRaw);
    }

    async post(path, params, postBody){
        if (!path) {
            throw new Error("Invalid entity to read");
        }

        let url = this.options.endpoint + path + await this.queryString(params);

        return await Backend.request(url, false, postBody);
    }

    static async request(url, returnRaw, postBody) {
        if (this.requester) {
            return this.requester(url, returnRaw, postBody);
        }

        const isPost = !!postBody;
        const body = isPost ? JSON.stringify(postBody) : undefined;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {

            const res = await fetch(url, {
                method: isPost ? 'POST' : 'GET',
                headers: isPost ? {
                    'Content-Type': 'application/json'
                } : undefined,
                body,
                signal: controller.signal
            });

            const text = await res.text();
            clearTimeout(timeout);

            if (!res.ok) {
                const error = new Error(`HTTP ${res.status}`);
                error.response = text;
                throw error;
            }

            if (returnRaw) {
                return text;
            }

            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                e.response = text;
                throw e;
            }

            return json;
        } catch(e) {
            clearTimeout(timeout);
            throw e;
        }
    }
}

module.exports = Backend;
