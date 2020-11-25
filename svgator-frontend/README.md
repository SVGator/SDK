## SVGator's JavaScript Frontend SDK

This JS SDK lets your users connect their SVGator account with your application. Please note that SVGator **strongly recommends the usage of the Frontend SDK** over direct API calls.

### Before You Start
<a href="http://example.com" target="_blank">example</a>



In order to use SVGator's API & SDKs, one first must obtain an SVGator Application. To do so, please email [contact@svgator.com](mailto:contact@svgator.com?subject=SVGator%20Application%20Request&body=Dear%20Support%2C%0D%0A%0D%0AMy%20name%20is%20%5BJOHN%2FJANE%20DOE%5D%20from%20%5BCOMPANY%2C%20INC.%5D.%0D%0APlease%20add%20an%20SVGator%20application%20to%20my%20account%20of%20%5BEMAIL%40COMPANY.COM%5D%2C%20in%20order%20to%20offer%20my%20users%20to%20connect%20their%20SVGator%20accounts%20with%20my%20software.){:target="_blank" rel="noopener"}, providing your SVGator account ID and the desired usage of your SVGator application.

The API keys one should receive are:
- The Application ID, used as "app_id" in requests, prefixed with "ai_", followed by 32 alphanumeric chars; i.e. `ai_b1357de7kj1j3ljd80aadz1eje782f2k`  
- Your Secret Key, prefixed with "sk_", followed by 32 alphanumeric chars; i.e. `sk_58ijx87f45596ylv5jeb1a5vicdd92i4`
- **Attention**: Your Secret Key should never be present in any requests, neither be present on Front-End. 

### Requirements

- nodejs >= 7.6 (for self-hosted version)
- none (for CDN version hosted by SVGator.com)

### Installation

Run the following command in the directory where you want to install the module (for self-hosted version only):
```
npm i @svgator/sdk-frontend
```

Optionally, you can also use SVGator's CDN to load the latest version of frontend SDK into your site using [this CDN Link](https://cdn.svgator.com/sdk/svgator-frontend.latest.js){:target="_blank"}. Find a [detailed example here](./example.html){:target="_blank"}.

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

// initiated by a user action (i.e. click on a log in button), one should call loginWithPopup() OR loginWithRedirect(), mapped to a 
```

### Usage from CDN
 Find a [detailed example here](./example.html).

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.svgator.com/sdk/svgator-frontend.latest.js"></script>
    <script>
        function loginWithPopup()
        {
            let appId = 'ai_...';
            window.SVGator
                .auth(appId)
                .then(function (result) {
                    // @todo return result.auth_code to your backend & obtain an access_token with it
                }).catch(function (result) {
                let msg = result && result.msg || "Unknown Error";
                msg += result && result.code ? ' (#' + result.code + ')' : '';
                console.log(msg);
            });
        }

        function loginWithRedirect()
        {
            let appId = 'ai_...';
            // @todo return auth_code from redirected URL params to your backend & obtain an access_token with it
            window.SVGator.auth(appId, document.location.href);
        }
    </script>
</head>
<body>
    <button onclick="loginWithPopup()">Connect to SVGator with Popup</button>
    <br>
    <br>
    <button onclick="loginWithRedirect()">Connect to SVGator with Redirect</button>    
</body>
</html>
```
