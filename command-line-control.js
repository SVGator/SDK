const SVGatorBackend  = require("./svgator-backend/index.js");

let auth_code = '';
let access_token = '';
let customer_id = '';
let project_id = '';
let domain = 'http://localhost:8080';
let action;
let app_id = '';
let secret_key = '';

for(let i = 0; i < process.argv.length; i++) {
    let arg = process.argv[i];
    if (arg.toString().match(/^ac_/)) {
        auth_code = arg.toString();
    }
    if (arg.toString().match(/^at_/)) {
        access_token = arg.toString();
    }
    if (arg.toString().match(/^ai_/)) {
        app_id = arg.toString();
    }
    if (arg.toString().match(/^sk_/)) {
        secret_key = arg.toString();
    }
    if (arg.toString().match(/^ci_/)) {
        customer_id = arg.toString();
    }
    if (arg.toString().match(/^pi_/)) {
        project_id = arg.toString();
    }
    if (arg.toString().match(/app\.svgator\.(?:com)/)) {
        domain = 'https://' + arg.toString();
    }
    if (arg.toString().match(/--action\=/)) {
        action = arg.toString().replace(/--action=/, '');
    }
}

let svgator = new SVGatorBackend({
    app_id: app_id,
    secret_key: secret_key,
    endpoint: domain + '/api/app-auth',
});

/**
 * @param {Promise.<object>} promise
 * @param {boolean} returnRaw
 */
function handlePromise(promise, returnRaw) {
    promise
        .then(function(response) {
            console.log(returnRaw ? response : JSON.stringify(response));
        })
        .catch(function(err) {
            let error = err.message ? err.message : err.toString();
            console.log(JSON.stringify({error}));
        })
        .finally(function() {
            process.exit();
        });
};

switch(action) {
    case 'get-token':
        handlePromise(svgator.token.get(auth_code));
        break;
    case 'get-projects':
        handlePromise(svgator.projects.getAll(access_token, customer_id, 1000, 0));
        break;
    case 'get-project':
        handlePromise(svgator.projects.get(access_token, project_id));
        break;
    case 'export':
        handlePromise(svgator.projects.export(access_token, project_id), true);
        break;
    default:
        console.log(JSON.stringify({error: "Wrong action"}));
}