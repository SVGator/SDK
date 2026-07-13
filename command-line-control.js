// @todo once new SDK goes live, let's rather upgrade node module & use the public node module
// import SVGatorBackend from "@svgator/sdk-backend";
// ESM has no directory resolution, so point at the package entry file explicitly
// (the dir's package.json "main" is ignored for relative imports).
import SVGatorBackend from "@svgator/sdk-backend";
import {readFileSync} from 'fs';

let auth_code = '';
let access_token = '';
let customer_id = '';
let project_id = '';
let asset_id = '';
let folder_id = '';
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
        render_id, project_id, asset_id, folder_id, customer_id, access_token, auth_code, options,
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
    for (let i = 0; i < process.argv.length; i++) {
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
        if (arg.toString().match(/^as_/)) {
            asset_id = arg.toString();
        }
        if (arg.toString().match(/^fd_/)) {
            folder_id = arg.toString();
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
    case 'get-skeleton':
        void runCommand('svgator.projects.skeleton(access_token, project_id, filter)');
        break;
    case 'get-project-part':
        void runCommand('svgator.projectParts.get(access_token, project_id, filter?.item, filter)');
        break;
    // save-project-part carries no explicit action, so it maps to the default
    // update edit (item from the filter, new value in the body).
    case 'save-project-part':
        void runCommand('svgator.projectParts.update(access_token, project_id, filter?.item, options, {preview: filter?.preview})');
        break;
    case 'save-project':
        void runCommand('svgator.projects.save(access_token, options || {smokeTest: true}, project_id)');
        break;
    // Asset endpoints. list takes customer_id + limit/offset/search; get/save address
    // a single asset by asset_id (empty asset_id on save = create).
    case 'get-assets':
        void runCommand('svgator.assets.getAll(access_token, customer_id, filter?.limit, filter?.offset, filter?.search ? {search: filter.search} : null)');
        break;
    case 'get-asset':
        void runCommand('svgator.assets.get(access_token, asset_id)');
        break;
    case 'save-asset':
        void runCommand('svgator.assets.save(access_token, options || {smokeTest: true}, asset_id)');
        break;
    // Folder endpoints. list takes customer_id + limit/offset/search; get/save address
    // a single folder by folder_id (empty folder_id on save = create). Only `title`
    // is editable through save.
    case 'get-folders':
        void runCommand('svgator.folders.getAll(access_token, customer_id, filter?.limit, filter?.offset, filter?.search ? {search: filter.search} : null)');
        break;
    case 'get-folder':
        void runCommand('svgator.folders.get(access_token, folder_id)');
        break;
    case 'save-folder':
        void runCommand('svgator.folders.save(access_token, options || {title: "Smoke test folder"}, folder_id)');
        break;
    // Project-part edits via the typed svgator.projectParts.* wrappers. `filter`
    // carries item/preview; `options` is the body (the new value for update, the
    // element subtree for inserts, { target, position } for move; delete takes no
    // body).
    case 'part-update':
        void runCommand('svgator.projectParts.update(access_token, project_id, filter?.item, options, {preview: filter?.preview})');
        break;
    case 'part-before':
        void runCommand('svgator.projectParts.before(access_token, project_id, filter?.item, options, {preview: filter?.preview})');
        break;
    case 'part-after':
        void runCommand('svgator.projectParts.after(access_token, project_id, filter?.item, options, {preview: filter?.preview})');
        break;
    case 'part-prepend':
        void runCommand('svgator.projectParts.prepend(access_token, project_id, filter?.item, options, {preview: filter?.preview})');
        break;
    case 'part-append':
        void runCommand('svgator.projectParts.append(access_token, project_id, filter?.item, options, {preview: filter?.preview})');
        break;
    case 'part-delete':
        void runCommand('svgator.projectParts.delete(access_token, project_id, filter?.item, {preview: filter?.preview})');
        break;
    case 'part-move':
        void runCommand('svgator.projectParts.move(access_token, project_id, filter?.item, options?.target, options?.position, {preview: filter?.preview})');
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
