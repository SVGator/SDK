const https = require('https');
const http = require('http');
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

    addHash(params){
        params.hash = Object.keys(params).sort().reduce((acc, curr) => {
            return acc + params[curr];
        }, '');

        params.hash += this.options.secret_key || '';
        params.hash = crypto.createHash("sha256").update(params.hash).digest("hex");
    }

    queryString(params) {
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

        this.addHash(params);
        return Object.keys(params).reduce((acc, curr) => {
            return acc + (acc ? '&' : '?') + encodeURIComponent(curr) + '=' + encodeURIComponent(params[curr]);
        }, '');
    }

    async get(path, params, returnRaw){
        if (!path) {
            throw new Error("Invalid entity to read");
        }

        let url = this.options.endpoint + path + this.queryString(params);

        return await Backend.request(url, returnRaw);
    }

    async post(path, params, postBody){
        if (!path) {
            throw new Error("Invalid entity to read");
        }

        let url = this.options.endpoint + path + this.queryString(params);

        return await Backend.request(url, false, postBody);
    }

    static request(url, returnRaw, postBody){
        if (this.requester) {
            return this.requester(url, returnRaw, postBody);
        }

        postBody = postBody ? JSON.stringify(postBody) : null;

        return new Promise((resolve, reject) => {
            let proto = url.match(/^https:/) ? https : http;
            const options = {
                method: postBody ? 'POST' : 'GET',
            };
            if (postBody) {
                options.headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postBody),
                }
            }
            const clientRequest = proto.request(url, options, (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    if (returnRaw) {
                        return resolve(data);
                    }

                    let json;
                    try {
                        json = JSON.parse(data);
                    } catch(e) {
                        e.response = data;
                        return reject(e);
                    }
                    resolve(json);
                });

            });
            clientRequest.on("error", (err) => {
                reject(err);
            });

            if (postBody) {
                clientRequest.write(postBody);
            }
            clientRequest.end();
        });
    }
}

module.exports = Backend;
