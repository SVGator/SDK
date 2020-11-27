# SVGator API & SDK documentation

Using SVGator's SDKs (Software Development Kit) to interact with SVGator's API (Application Programming Interface) will allow your users to connect their SVG projects to your application.

Please note that we **strongly recommend the usage of the included SDKs** over direct API calls.

## Table of Contents

1. [Before You Start](#1-before-you-start)
2. [Frontend API](#2-frontend-api)
    1. [Connect Users with a Popup Window](#2i-connect-users-with-a-popup-window)
    2. [Connect Users through a Redirect URL](#2ii-connect-users-through-a-redirect-url)
    3. [Dynamic App Creation](#2iii-dynamic-app-creation)
3. [Backend API](#3-backend-api)
    1. [Obtain an `access_token`](#3i-obtain-an-access_token)
    2. [Obtain an `access_token` for a Dynamic App](#3ii-obtain-an-access_token-for-a-dynamic-app)
    3. [How to generate the `hash` security token](#3iii-how-to-generate-the-hash-security-token)
    4. [List of SVG Projects](#3iv-list-of-svg-projects)
    5. [Details of an SVG Project](#3v-details-of-an-svg-project)
    6. [Export an Animated SVG Project](#3vi-export-an-animated-svg-project)
    7. [Error Handling](#3vii-error-handling)
4. [Further Resources](#4-further-resources)

## 1. Before You Start

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


Creating an application on the fly is also possible using [`appId=dynamic`](#2iii-dynamic-app-creation), yet this feature comes with restrictions. For a multi-user implementation follow the steps above instead.

## 2. Frontend API
We encourage to use SVGator's own [Frontend SDK](../master/svgator-frontend) (offered as a CDN [link](https://cdn.svgator.com/sdk/svgator-frontend.latest.js) with a detailed [example](../master/svgator-frontend/example.html) as well as a Node [package](https://www.npmjs.com/package/@svgator/sdk-frontend)) over own implementation of frontend API calls.

### 2.I. Connect Users with a Popup Window
Open a pop-up window from JS letting your users to connect their SVGator account to your app.
- **Endpoint**: `https://app.svgator.com/app-auth/connect`
- **Method**: `GET`
- **Parameters**:

| Name | Description |
|------|------|
| `appId` | your Application ID |
| `origin` | origin of the opener window, url encoded |
 
##### Sample URL
`https://app.svgator.com/app-auth/connect?appId=ai_b1357de7kj1j3ljd80aadz1eje782f2k&origin=https%3A//example.com`

##### Success response
```json
{
  "code":0,
  "msg":{
    "auth_code":"ac_3db45107d0833b4bb8g43a67380e51fe",
    "auth_code_expires":1606415498,
    "app_id":"ai_b1357de7kj1j3ljd80aadz1eje782f2k"
  }
}
```
After the user has successfully logged in to SVGator and authorized your application, the API will send the string response above as a postMessage to your window.

##### Success response - parameters
| Name | Description |
|------|------|
| `app_id` | your Application ID |
| `auth_code` | your authentication code needed to generate a back-end [`access_token`](#3i-obtain-an-access_token)|
| `auth_code_expires` | the exiration time of `auth_code` in unix timestamp; defaults to 5 minutes |

##### Authorization Popup - Screenshot
<details><summary>view</summary>
<p align="center">
![Authorization Popup](../doc/assets/Authorization-Popup.png)
</p>
</details>

### 2.II. Connect Users through a Redirect URL
Point your users to SVGator's URL to connect their SVGator account to your app.
- **Endpoint**: `https://app.svgator.com/app-auth/connect`
- **Method**: `GET`
- **Parameters**:

| Name | Description |
|------|------|
| `appId` | your Application ID |
| `redirect` | origin of the opener window, url encoded |
 
##### Sample URL
`https://app.svgator.com/app-auth/connect?appId=ai_b1357de7kj1j3ljd80aadz1eje782f2k&redirect=https%3A//example.com`

##### Success response
`https://example.com/?auth_code=ac_3db45107d0833b4bb8g43a67380e51fe&auth_code_expires=1606421028&app_id=ai_b1357de7kj1j3ljd80aadz1eje782f2`

After the user has successfully logged in to SVGator and authorized your application, the API will redirect them to the URL you provided, suffixed with response parameters.

##### Success response - parameters
Same as connecting users with a [popup window](#success-response---parameters).
<br>

### 2.III. Dynamic App Creation
This feature is intended for applications with a single user access or from pages where the owner doesn't want to have control over the application itself (an example being SVGator's Wordpress [plugin](https://wordpress.org/plugins/svgator/)).

This usecase is identical to connecting users with a [popup window](#2i-connect-users-with-a-popup-window) with the exception that one should pass `appId=dynamic`.

See further restrictions under obtaining an [`access_token`](#3ii-obtain-an-access_token-for-a-dynamic-app).
<br>

## 3. Backend API
This section describes server to server API requests, available only for application already having authorized users, as described under Frontend [section](#2-frontend-api).

Again, we strongly recommend to use vendor backend SDKs ([PHP](../master/svgator-php) or [Node.js](../master/svgator-backend)) over custom implementation of API calls.

### 3.I. Obtain an `access_token`
In order order to interact with users' projects on SVGator, the next step is to obtain an `access_token`, which is specific to given application and to the current user.

- **Endpoint**: `https://app.local/api/app-auth/token`
- **Method**: `GET`
- **Parameters**:

| Name | Description |
|------|------|
| `app_id` | your Application ID, provided by SVGator |
| `auth_code` | the authentication code received from Frontend API |
| `time` | current unix timestamp |
| `hash` | 64 chars sha256 security token; see generation details [under 3.III.](#3iii-how-to-generate-the-hash-security-token) |
 
##### Sample URL
```url
https://app.local/api/app-auth/token?app_id=ai_b1357de7kj1j3ljd80aadz1eje782f2k&time=1606424900&auth_code=ac_3db45107d0833b4bb8g43a67380e51fe&hash=8a022f4cedc9f1145e75d50dd96021fd5da757010f000f72d4f8a358730e07f1
```
##### Success response
```json
{
  "access_token": "at_826a1294b59a229412546cadf1b7ef66",
  "customer_id": "ci_90c94934c0fce81bddf42385f1432169"
}
```
Save both values for later usage. The given access token will allow you to retrieve all the SVGs for the given customer for a period of 6 months, or until the user revokes your permissions from their account settings.
<br>

### 3.II. Obtain an `access_token` for a Dynamic App
Generating an `access_token` for a Dynamic App is highly similar to the previous point, the difference being that in this case `secret_key` will be returned in the response, togheter with `access_token` and `customer_id`.

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
          :black_medium_small_square: For dynamic application, each `token` request will invalidate previous `auth_codes`, yet already issued `access_tokens` will remain functional.
          <br />
          :black_medium_small_square: Also to be noted that an `app_id` and `secret_key` pair obtained for a dynamic app cannot be used to gain access to other users' projects.
      </td>
    </tr>
  </tbody>
</table>

- **Endpoint**: `https://app.local/api/app-auth/token`
- **Method**: `GET`
- **Parameters**:

| Name | Description |
|------|------|
| `app_id` | your Application ID returned by [Frontend](#2i-connect-users-with-a-popup-window) authentication |
| `auth_code` | the authentication code received from Frontend API |
| `time` | current unix timestamp |
| `hash` | 64 chars sha256 security token; see generation details [under 3.III.](#3iii-how-to-generate-the-hash-security-token) |
 
##### Sample URL
```url
https://app.local/api/app-auth/token?app_id=ai_b1357de7kj1j3ljd80aadz1eje782f2k&time=1606424900&auth_code=ac_3db45107d0833b4bb8g43a67380e51fe&hash=8bb464918035de36f09a49dd5d247045f2e6daaee49ea97dc3fba363e39f7b39
```
##### Success response
```json
{
  "access_token": "at_826a1294b59a229412546cadf1b7ef66",
  "customer_id": "ci_90c94934c0fce81bddf42385f1432169",
  "app_id": "ai_b1357de7kj1j3ljd80aadz1eje782f2k",
  "secret_key": "sk_ec55dda518dd823cb404g532316c09c36"
}
```
Save all values for later usage. `secret_key` must be used to generate the [`hash`](#3iii-how-to-generate-the-hash-security-token) security token further on.
<br>

### 3.III. How to generate the `hash` security token
Each server to server request must contain a valid `hash` parameter, generated based on request parameters as described below. Let's consider as an example the access_token request from [3.I.](#3i-obtain-an-access_token) As a first step, collect all parameters from a given request, which for this example will be the following:

| Name | Value |
|------|------|
| `app_id` | `ai_b1357de7kj1j3ljd80aadz1eje782f2k` |
| `time` | `1606424900` |
| `auth_code` | `ac_3db45107d0833b4bb8g43a67380e51fe` |

Sort the parameters alphabetically by their names:

| Name | Value |
|------|------|
| `app_id` | `ai_b1357de7kj1j3ljd80aadz1eje782f2k` |
| `auth_code` | `ac_3db45107d0833b4bb8g43a67380e51fe` |
| `time` | `1606424900` |

Next, concatenate their values (without any separator):

`ai_b1357de7kj1j3ljd80aadz1eje782f2kac_3db45107d0833b4bb8g43a67380e51fe1606424900`

The next step is appending `secret_key`, but there is an exception for that - obtaining an `access_token` for a Dynamic App ([3.II.](#3ii-obtain-an-access_token-for-a-dynamic-app)). That is the single request in which case `secret_key` could not be used for `hash` generation, since it is not yet available to the API client. 

In that case, `secret_key` should be considered an empty string, yet `hash` still needs to be generated. In all other cases, the `secret_key` (either recieved from SVGator or returned by dynamic app `token` request) should be appended to the given string.

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
          :black_medium_small_square: The `secret_key` itself should never be added to any of the URLs.
      </td>
    </tr>
  </tbody>
</table>

For the sake of the example, let's assume your `secret_key` is `sk_ec55dda518dd823cb404g532316c09c36`, which appended to the end of the current `hash` will result in:

`ai_b1357de7kj1j3ljd80aadz1eje782f2kac_3db45107d0833b4bb8g43a67380e51fe1606424900sk_ec55dda518dd823cb404g532316c09c36`

Now generate the sha256 hash of the given string:

`8a022f4cedc9f1145e75d50dd96021fd5da757010f000f72d4f8a358730e07f1`

Use the result string as `&hash=` parameter in the request. Find examples on how to generate a hash in PHP [here](https://www.php.net/manual/en/function.hash.php), respectively Node.js [here](https://nodejs.org/api/crypto.html).
<br>

### 3.IV. List of SVG Projects
Retrieve all SVG projects for a given user.
- **Endpoint**: `https://app.local/api/app-auth/projects`
- **Method**: `GET`
- **Parameters**:

| Name | Description |
|------|------|
| `app_id` | your Application ID |
| `access_token` | the access token received from `token` request, specific to the given user |
| `customer_id` | the customer you want to get the list of projects for; `customer_id` received from `token` request |
| `time` | current unix timestamp |
| `hash` | 64 chars sha256 [security token](#3iii-how-to-generate-the-hash-security-token) |

##### Sample URL
```url
https://app.local/api/app-auth/projects?app_id=ai_b1357de7kj1j3ljd80aadz1eje782f2k&time=1606424900&access_token=at_826a1294b59a229412546cadf1b7ef66&customer_id=ci_90c94934c0fce81bddf42385f1432169&hash=df711b4e3626d65d256842d28b43d89196f09e5ac2a772ce2e882bdb655a2bf8
```
##### Success response
```json
{
    "projects": [
        {
            "id": "pi_scf57osvhoc2hptnmqap79lvfdpld9xi",
            "title": "Web Dise\u00f1o",
            "preview": "https://cdn.svgator.com/project/m7/50/07gorpgkdpm6m6dnwq03oyfb1kej/prv.svg",
            "created": 1606300441,
            "updated": 1606300711
        },
        {
            "id": "pi_uinfb7kl855j2yxpbsglty0eo28yd8jp",
            "title": "SAMPLE PROJECT1",
            "preview": "https://cdn.svgator.com/project/4h/xx/6cjqkpmvz8fasvp1ch2vfavcgw5o/prv.svg",
            "created": 1606137253,
            "updated": 1606137253
        },
    ]
}
```
Only 2 sample projects are listed above, but please note that given request will return all projects of the current user.
- Use `projects[i]->id` in further requests to obtain up to date details of the given project
- `title` will hold the name of the project, given by its owner (the current user)
- `preview` points to a static version of the SVG projects to be used in previews and thumbnails
- `created` & `updated` fields are unix timestamps

### 3.V. Details of an SVG Project
Retrieve details about a given SVG project of the current user.
- **Endpoint**: `https://app.local/api/app-auth/project`
- **Method**: `GET`
- **Parameters**:

| Name | Description |
|------|------|
| `project_id` | the ID of the SVG project, retreived by the previous request |
| `app_id` | your Application ID |
| `access_token` | the access token received from `token` request, specific to the given user |
| `customer_id` | the customer you want to get the list of projects for; `customer_id` received from `token` request |
| `time` | current unix timestamp |
| `hash` | 64 chars sha256 [security token](#3iii-how-to-generate-the-hash-security-token) |

##### Sample URL
```url
https://app.svgator.com/api/app-auth/project?project_id=pi_scf57osvhoc2hptnmqap79lvfdpld9xi&app_id=ai_b1357de7kj1j3ljd80aadz1eje782f2k&customer_id=ci_90c94934c0fce81bddf42385f1432169&access_token=at_826a1294b59a229412546cadf1b7ef66&time=1606424900&hash=8faa921320977dec53a206411e115cf82fddd0906c9af531682d298048ff77f8
```
##### Success response
```json
{
    "project":
    {
        "id": "pi_scf57osvhoc2hptnmqap79lvfdpld9xi",
        "title": "Web Dise\u00f1",
        "preview": "https://cdn.svgator.com/project/m7/50/07gorpgkdpm6m6dnwq03oyfb1kej/prv.svg",
        "label": "TEST LABEL",
        "created": 1606300441,
        "updated": 1606300711
    }
}
```
`label` field denotes the tag given to the project by its owner and it is optional. The rest of the response fields are identical to project list response.
<br>

### 3.VI. Export an Animated SVG Project
Retrieve the animated SVG project of the user as raw text.
- **Endpoint**: `https://app.local/api/app-auth/export`
- **Method**: `GET`
- **Parameters**:

| Name | Description |
|------|------|
| `project_id` | the ID of the SVG project, retreived by a previous request or stored locally |
| `app_id` | your Application ID |
| `access_token` | the access token received from `token` request, specific to the given user |
| `customer_id` | the customer you want to get the list of projects for; `customer_id` received from `token` request |
| `time` | current unix timestamp |
| `hash` | 64 chars sha256 [security token](#3iii-how-to-generate-the-hash-security-token) |
##### Sample URL
```url
https://app.svgator.com/api/app-auth/export?project_id=pi_scf57osvhoc2hptnmqap79lvfdpld9xi&app_id=ai_b1357de7kj1j3ljd80aadz1eje782f2k&customer_id=ci_90c94934c0fce81bddf42385f1432169&access_token=at_826a1294b59a229412546cadf1b7ef66&time=1606424900&hash=8faa921320977dec53a206411e115cf82fddd0906c9af531682d298048ff77f8
```
##### Success response
`Content-Type: image/svg+xml`
```
   <svg id="egain0g46a2d1" ...>
      ...
      <script>...</script>
   </svg>
```
The response will be raw text, containing the SVG data. Save such projects locally and update them periodically or on user's action. Serve the saved version to actual end-users and/or in a web page.
<br>

### 3.VII. Error Handling
In case of error HTTP response will remain 200 and the body of the request will hold the JSON object below:
```
{
    "error": "Here comes the error message",
    "error_description": "This is an optional description. Most of the cases this property is missing."
}
```
All responses should be validated against the given structure. HTTP response codes different than 200 might also appear in case of a network issue.
<br>

## 4. Further Resources
Frontend SDK:
- SVGator Frontend SDK [documentation :link: ](../master/svgator-frontend) is avaiable on Github, as well as a [usage example :link: ](../master/svgator-frontend/example.html) 
- SVGator Frontend SDK is also available as [@svgator/sdk-frontend :link: ](https://www.npmjs.com/package/@svgator/sdk-frontend) Node package

Backend SDK:
- SVGator provides a PHP Backend SDK available on [Github :link: ](../master/svgator-php)
- Node.js version is also available through npm as [@svgator/sdk-backend :link: ](https://www.npmjs.com/package/@svgator/sdk-backend)

For further support & questions, feel free to contact us at <contact@svgator.com>.
