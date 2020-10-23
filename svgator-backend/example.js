/**
 * @author Tibor Vincze
 * @date 10/20/2020 2:12 PM
 */

const SVGatorBackend  = require("./index.js");

let auth_code = '';

async function run(){

    let svgator = new SVGatorBackend({
        app_id: 'ai_...',
        secret_key: 'sk_...',
    });

    // obtain an access_token based on the auth_code received on front-end
    let {access_token, customer_id} = await svgator.token.get(auth_code);

    // read all SVG projects for a user. limit & offset arguments are optional
    let limit = 1000;
    let offset = 0;
    let {projects} = await svgator.projects.getAll(access_token, customer_id, limit, offset);

    let project_id = projects[0].id;

    // read a single SVG project based on ID
    let {project} = await svgator.projects.get(access_token, project_id);

    // obtain the animated SVG from SVGator
    return svgator.projects.export(access_token, project.id);
}

// output the first animated SVG from the user's account
console.log(run());