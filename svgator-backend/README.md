## JavaScript BackEnd SDK

This Node.js SDK lets your application connect to your users' SVGator projects, after they authorized the access using the [Frontend SDK](../svgator-frontend). Please note that SVGator **strongly recommends the usage of the Backend SDK** over direct API calls.

### Before You Start

In order to use SVGator's API & SDKs, one first must obtain an SVGator Application. To do so, please email [contact@svgator.com](mailto:contact@svgator.com?subject=SVGator%20Application%20Request&body=Dear%20Support%2C%0D%0A%0D%0AMy%20name%20is%20%5BJOHN%2FJANE%20DOE%5D%20from%20%5BCOMPANY%2C%20INC.%5D.%0D%0APlease%20add%20an%20SVGator%20application%20to%20my%20account%20of%20%5BEMAIL%40COMPANY.COM%5D%2C%20in%20order%20to%20offer%20my%20users%20to%20connect%20their%20SVGator%20accounts%20with%20my%20software.), providing your SVGator account ID and the desired usage of your SVGator application.

The API keys one should receive from [contact@svgator.com](mailto:contact@svgator.com?subject=SVGator%20Application%20Request&body=Dear%20Support%2C%0D%0A%0D%0AMy%20name%20is%20%5BJOHN%2FJANE%20DOE%5D%20from%20%5BCOMPANY%2C%20INC.%5D.%0D%0APlease%20add%20an%20SVGator%20application%20to%20my%20account%20of%20%5BEMAIL%40COMPANY.COM%5D%2C%20in%20order%20to%20offer%20my%20users%20to%20connect%20their%20SVGator%20accounts%20with%20my%20software.) are shown below:

| Name | Description | Notes | Sample Value |
|------|------|------------|----------|
| `app_id` | Application ID |prefixed with "ai_", followed by 32 alphanumeric chars|`ai_b1357de7kj1j3ljd80aadz1eje782f2k`|
| `secret_key` | Secret Key |prefixed with "sk_", followed by 32 alphanumeric chars|`sk_58ijx87f45596ylv5jeb1a5vicdd92i4`|



<table>
  <thead>
    <tr>
      <th align="left">
        :exclamation: Attention
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
          :black_medium_small_square: Your Secret Key must not be included in any requests, neither be present on Front-End.
      </td>
    </tr>
  </tbody>
</table>


Creating an application on the fly is also possible using [`appId=dynamic`](../master/#2iii-dynamic-app-creation), yet this feature comes with restrictions. For a multi-user implementation follow the steps above instead.

### Requirements

- nodejs >= 7.6 (for self-hosted version)

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
