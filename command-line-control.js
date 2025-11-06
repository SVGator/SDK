const SVGatorBackend  = require("@svgator/sdk-backend");

let auth_code = '';
let access_token = '';
let customer_id = '';
let project_id = '';
let render_id = '';
let domain = 'http://localhost:8080';
let action;
let app_id = '';
let secret_key = '';
let filter = null;
let oauthId = null;

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
    if (arg.toString().match(/^oi_/)) {
        oauthId = arg.toString();
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
    if (arg.toString().match(/^ri_/)) {
        render_id = arg.toString();
    }
    if (arg.toString().match(/app\.svgator\.(?:com)/)) {
        domain = 'https://' + arg.toString();
    }
    if (arg.toString().match(/--action\=/)) {
        action = arg.toString().replace(/--action=/, '');
    }
    if (arg.toString().match(/--filter\=/)) {
        filter = arg.toString().replace(/--filter=/, '');
        filter = JSON.parse(filter);
    }
}


let svgator = app_id && secret_key ? new SVGatorBackend({
    app_id: app_id,
    secret_key: secret_key,
    endpoint: domain + '/api/app-auth',
}) : null;

/**
 * @param {Promise.<object>} promise
 */
async function handlePromise(promise) {
    try {
        const response = await promise;
        return typeof response === 'object' ? JSON.stringify(response) : response;
    } catch (err) {
        let error = err.message ? err.message : err.toString();
        const output = {error};
        if (err.response) {
            output.response = err.response;
        }
        return JSON.stringify(output);
    }
}

async function runCommand(command) {
    const promise = eval(command);
    const output = await handlePromise(promise);
    console.log(JSON.stringify({command, output}));
    process.exit();
}

switch (action) {
    case 'get-token':
        void runCommand('svgator.token.get(auth_code)');
        break;
    case 'get-projects':
        void runCommand('svgator.projects.getAll(access_token, customer_id, 1000, 0, ' + JSON.stringify(filter) + ')');
        break;
    case 'get-project':
        void runCommand('svgator.projects.get(access_token, project_id)');
        break;
    case 'get-renders':
        void runCommand('svgator.renders.getAll(access_token, customer_id, 1000, 0, ' + JSON.stringify(filter) + ')');
        break;
    case 'get-render':
        void runCommand('svgator.renders.get(access_token, render_id)');
        break;
    case 'export':
        void runCommand('svgator.projects.export(access_token, project_id)');
        break;
    case 'get-profile':
        void runCommand('svgator.profile.get(access_token, customer_id)');
        break;
    case 'get-oauth':
        void runCommand('SVGatorBackend.getOauth(app_id, domain)');
        break;
    case 'check-oauth':
        void runCommand('SVGatorBackend.waitOauth(app_id, domain, oauthId, 10).then(res => ({token: res?.token, status: res?.status}))');
        break;
    default:
        console.log(JSON.stringify({error: "Wrong action"}));
}
