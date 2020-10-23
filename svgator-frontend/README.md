## JavaScript FrontEnd SDK

This library makes easier to make the initial authorization by the user for your app.

### Requirements

nodejs ^7.6

### Installation

Run the following command in the directory where you want to install the module
```
npm i @svgator/sdk-frontend
```

Optionally, you can also use our CDN to load our frontend SDK into your site:
[CDN Link](http://example.com)

### Usage as Node Module

```js
const SVGatorFrontend = require("@svgator/sdk-frontend");
// You may also import our module by:
// import SVGatorFrontend from "@svgator/sdk-frontend";

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

// you should call loginWithPopup() OR loginWithRedirect()
```

### Usage from CDN

```html
<html>
<head>
<script src="https://cdn.svgator.com/sdk/svgator-frontend.1-0-1.js"></script>
<script>
function loginWithPopup(){
    let appId = 'ai_...';
    window.SVGator.auth(appId).then(function(result){
        // @todo return result.auth_code to your backend & obtain an access_token with it
    }).catch(function(result){
        console.log(result.error);
    });
}
</script>
</head>
<body>
<button onclick="loginWithPopup()">Connect to SVGator</button>
</body>
</html>
```