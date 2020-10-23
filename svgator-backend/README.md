## JavaScript BackEnd SDK

### Requirements

nodejs ^7.6

### Installation

Run the following command in the directory where you want to install the module
```
npm i @svgator/sdk-backend
```

### Usage

```js
const SVGatorBackend  = require("@svgator/sdk-backend");
// You may also import our module by:
// import SVGatorBackend from "@svgator/sdk-backend";

let auth_code = 'ac_...';
let app_id = 'ai_...';
let secret_key = 'sk_...';
            
async function run(){

    let svgator = new SVGatorBackend({app_id, secret_key});

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
run()
.then((svg)=>console.log(svg))
.finally(()=>process.exit());

```