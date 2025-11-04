const https = require('https');
const http = require('http');
const crypto = require('crypto');

/**
 * @author Tibor Vincze
 * @date 10/13/2020 5:00 PM
 */

class Backend {
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

    async get(path, params, returnRaw){

        if (!params || !path) {
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
        params = Object.keys(params).reduce((acc, curr) => {
            return acc + (acc ? '&' : '?') + encodeURIComponent(curr) + '=' + encodeURIComponent(params[curr]);
        }, '');
        let url = this.options.endpoint + path + params;

        return await this.request(url, returnRaw);
    }

    request(url, returnRaw){
        return new Promise((resolve, reject) => {
            let proto = url.match(/^https:/) ? https : http;
            proto.get(url, (resp) => {
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
                        return reject(e);
                    }
                    resolve(json);
                });

            }).on("error", (err) => {
                reject(err);
            });
        });
    }
}

module.exports = Backend;
