/**
 * @author Tibor Vincze
 * @date 10/20/2020 2:12 PM
 */

const SVGatorBackend  = require("./index.js");

async function run(auth_code = '') {

    // @TODO - replace w/ your app_id: https://github.com/SVGator/SDK/tree/master/svgator-frontend
    const app_id = 'ai_...';
    // @TODO - replace w/ your secret_key: https://github.com/SVGator/SDK/tree/master/svgator-frontend
    const secret_key = 'sk_...';


    if (!app_id || !secret_key || !auth_code || app_id === 'ai_...' || secret_key === 'sk_...') {
        throw 'app_id, secret_key or auth_code is missing. Obtain these first. Read more: https://github.com/SVGator/SDK';
    }

    let svgator = new SVGatorBackend({
        app_id: app_id,
        secret_key: secret_key,
    });

    // obtain an access_token based on the auth_code received on front-end
    let {access_token, customer_id} = await svgator.token.get(auth_code);
    console.log({access_token, customer_id});

    // read all SVG projects for a user. limit & offset arguments are optional
    let limit = 1000;
    let offset = 0;
    let {projects} = await svgator.projects.getAll(access_token, customer_id, limit, offset);
    console.log('# of projects: ', projects.length);

    let project_id = projects[0].id;
    console.log('first project ID: ', project_id);

    // read a single SVG project based on ID
    let {project} = await svgator.projects.get(access_token, project_id);
    console.log('first project: ', project);

    // obtain the animated SVG from SVGator
    const exportedProject = await svgator.projects.export(access_token, project.id);

    console.log("exported project:\n", exportedProject);
    return exportedProject;

}

// @TODO - replace w/ your auth_code received from SVGator's Front End API: https://github.com/SVGator/SDK/tree/master/svgator-frontend
const auth_code = 'ac_...';

// output the first animated SVG from the user's account;
console.log(run(auth_code));
