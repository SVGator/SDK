/**
 * @author Tibor Vincze
 * @date 10/20/2020 4:14 PM
 */

import SVGatorFrontend from "./index.js";

let appId = 'ai_...';
let returnPage = 'https://example.com/my-return-url/?some=arguments';

async function loginWithPopup() {
    let {auth_code, auth_code_expires} = await SVGatorFrontend.auth(appId);
    // @todo return auth_code to your backend & obtain an access_token with it
}

function loginWithRedirect() {
    SVGatorFrontend.auth(appId, returnPage);
    // @todo on `returnPage`, handle the &auth_code=ac_... argument & obtain an access_token using it
}