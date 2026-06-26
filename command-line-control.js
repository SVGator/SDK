import SVGatorBackend from "@svgator/sdk-backend";
import {readFileSync} from 'fs';

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
let options = null;

function emit(command, output) {
    // PHP unwraps this {command, output} envelope; `output` is always a JSON string
    console.log(JSON.stringify({command, output}));
}

/**
 * Snapshot the parsed globals so a failure shows what the script actually
 * resolved its arguments to. Only truthy values are included; objects
 * (filter, options) are stringified.
 */
function collectVars() {
    const all = {
        oauthId, filter, app_id, secret_key, action, domain,
        render_id, project_id, customer_id, access_token, auth_code, options,
    };
    const vars = {};
    for (const [key, value] of Object.entries(all)) {
        if (!value) {
            continue;
        }
        vars[key] = typeof value === 'object' ? JSON.stringify(value) : value;
    }
    return vars;
}

/**
 * Emit a located error and stop. `stage` tells the PHP caller WHERE it broke:
 *  - 'args'   : parsing CLI arguments / --filter / --options
 *  - 'api'    : the API answered with an error response (err.response present)
 *  - 'sdk'    : the SDK call / response handling threw inside this script
 *  - 'script' : anything uncaught at the process level
 *
 * @param {string} stage
 * @param {*} err
 */
function fail(stage, err) {
    const payload = {
        error: err && err.message ? err.message : String(err),
        stage,
    };
    if (err && err.response) {
        payload.response = err.response;
    }
    if (err && err.stack) {
        payload.stack = err.stack;
    }
    const vars = collectVars();
    if (Object.keys(vars).length) {
        payload.vars = vars;
    }
    // Route through the same envelope so PHP can always locate the failure
    emit(null, JSON.stringify(payload));
    process.exit(1);
}

process.on('uncaughtException', (err) => fail('script', err));
process.on('unhandledRejection', (err) => fail('script', err));

try {
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
        if (arg.toString().trim().match(/(?:app|proxy)\.svgator\.(?:com|net)$/)) {
            domain = 'https://' + arg.toString();
        }
        if (arg.toString().match(/--action\=/)) {
            action = arg.toString().replace(/--action=/, '');
        }
        if (arg.toString().match(/--options\=/)) {
            const tmpFile = arg.toString().replace(/--options=/, '');
            options = readFileSync(tmpFile).toString();
            options = JSON.parse(options);
        }
        if (arg.toString().match(/--filter\=/)) {
            filter = arg.toString().replace(/--filter=/, '');
            filter = JSON.parse(filter);
        }
    }
} catch (err) {
    fail('args', err);
}


let svgator = app_id && (secret_key || action === 'get-token') ? new SVGatorBackend({
    app_id: app_id,
    secret_key: secret_key,
    endpoint: domain + '/api/app-auth',
}) : null;

async function runCommand(command) {
    let result;
    try {
        result = await eval(command);
    } catch (err) {
        // err.response present => the API answered with an error (locate it there);
        // otherwise the SDK call / response handling threw inside this script.
        fail(err && err.response ? 'api' : 'sdk', err);
        return;
    }
    const output = typeof result === 'object' ? JSON.stringify(result) : result;
    emit(command, output);
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
    case 'custom-export':
        void runCommand('svgator.projects.customExport(access_token, project_id, options)');
        break;
    case 'get-profile':
        void runCommand('svgator.profile.get(access_token, customer_id)');
        break;
    // TODO: switch to typed svgator.projects.* wrappers once Task M4 adds them to the @svgator/sdk-backend package (skeleton / getPart / savePart / save)
    case 'get-skeleton':
        void runCommand('svgator.backend.get("/skeleton", Object.assign({access_token, project_id}, filter || {}))');
        break;
    case 'get-project-part':
        void runCommand('svgator.backend.get("/project-part", Object.assign({access_token, project_id}, filter || {}))');
        break;
    case 'save-project-part':
        void runCommand('svgator.backend.post("/project-part", Object.assign({access_token, project_id}, filter || {}), options || {smokeTest: true})');
        break;
    case 'save-project':
        void runCommand('svgator.backend.post("/project", Object.assign({access_token, project_id}, filter || {}), options || {smokeTest: true})');
        break;
    case 'get-oauth':
        void runCommand('SVGatorBackend.getOauth(app_id, domain)');
        break;
    case 'check-oauth':
        void runCommand('SVGatorBackend.waitOauth(app_id, domain, oauthId, 10).then(res => ({token: res?.token, status: res?.status}))');
        break;
    default:
        fail('args', new Error('Unknown action: ' + action));
}
