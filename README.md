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
    4. List of SVG Projects
    5. Details of an SVG Project
    6. Export an SVG Project
    7. Error Handling
4. Further Resources


<hr><br><br><br>

4. [API actions](#api-actions)
7. [Error handling for backend requests](#error-handling-for-backend-requests)
9. [JavaScript FrontEnd SDK](#javascript-frontend-sdk)
0. [JavaScript BackEnd SDK](#javascript-backend-sdk)

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


Creating an application on the fly is also possible using [`appId=dynamic`](#dynamic-app-creation), yet this feature comes with restrictions. For a multi-user implementation follow the steps above instead.

## 2. Frontend API
We encourage to use SVGator's own [Frontend SDK](../master/svgator-frontend) (offered as a CDN [link](https://cdn.svgator.com/sdk/svgator-frontend.latest.js) with a detailed [example](../master/svgator-frontend/example.html) as well as a Node [package](https://www.npmjs.com/package/@svgator/sdk-backend)) over own implementation of frontend API calls.

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

This usecase is identical to connecting users with a [popup window](#connect-users-with-a-popup-window) with the exception that one should pass `appId=dynamic`.

See further restrictions under obtaining an [`access_token`](#3i-obtain-an-access_token-for-a-dynamic-app).
<br>

## 3. Backend API
This section describes server to server API requests, available only for application already having authorized users, as described under Frontend SDK & API [section](#2-frontend-api).

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
| `hash` | 64 chars sha256 security token; see generation details [below](#3iii-how-to-generate-the-hash-security-token) |
 
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
| `hash` | 64 chars sha256 security token; see generation details [below](#3iii-how-to-generate-the-hash-security-token) |
 
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
| `hash` | 64 chars sha256 [security token]((#3iii-how-to-generate-the-hash-security-token)) |

##### Sample URL
```url
https://app.local/api/app-auth/projects?app_id=ai_b1357de7kj1j3ljd80aadz1eje782f2k&time=1606424900&access_token=at_826a1294b59a229412546cadf1b7ef66&customer_id=ci_90c94934c0fce81bddf42385f1432169&hash=df711b4e3626d65d256842d28b43d89196f09e5ac2a772ce2e882bdb655a2bf8
```

<details>
    <summary>view all</summary>
    test
    <b>test2</b>
</details>


##### Success response
```json
{
    "projects": [
        {
            "id": "pi_SCF57OSVHOC2hptNMQAp79lvFdpLd9XI",
            "title": "Web Dise\u00f1o",
            "preview": "https://cdn.svgator.com/project/M7/50/07gORpgKdPm6M6dnWQ03oyfB1KEj/prv.svg",
            "created": 1606300441,
            "updated": 1606300711
        },
        {
            "id": "pi_uInFb7Kl855j2YXPBSGltY0eO28yD8jp",
            "title": "SAMPLE PROJECT1",
            "preview": "https://cdn.svgator.com/project/4H/xx/6cjqKPMvz8FASvp1CH2VFavcgW5O/prv.svg",
            "created": 1606137253,
            "updated": 1606137253
        },
        .......................
}
```
<details>
<summary>view all</summary>
```json
{
        {
            "id": "pi_RbDPChbgVmTzlvm37JpnRA7D6NUlLM0A",
            "title": "SAMPLE PROJECT2",
            "preview": "https://cdn.svgator.com/project/uQ/4E/84OKDgbEijzzIWKPkGaVMUNFQfo0/prv.svg",
            "created": 1605633029,
            "updated": 1605633029
        },
        {
            "id": "pi_ddrQ2oYL4Z7m3hTaVeSdDyUth4sBmszs",
            "title": "SAMPLE PROJECT3",
            "preview": "https://cdn.svgator.com/project/oq/BM/QGCd6dImUat6VUpmb5pEZwgWeOEz/prv.svg",
            "created": 1605598760,
            "updated": 1605598760
        },
        {
            "id": "pi_CcZwaIYoV1TEDMLcQFnI9udes0aWgtjT",
            "title": "SAMPLE PROJECT4",
            "preview": "https://cdn.svgator.com/project/cn/Pv/ILouoJa8B5WsFbfQufIrF9J26gUw/prv.svg",
            "created": 1605598646,
            "updated": 1605598647
        },
        {
            "id": "pi_dZdhKOapZF8wzKneTylrmx3OsyDQ9Wf6",
            "title": "SAMPLE PROJECT5",
            "preview": "https://cdn.svgator.com/project/nX/WL/YZfzzps21z0ZUExSOIjRHleiSlfT/prv.svg",
            "created": 1605515682,
            "updated": 1605515683
        },
        {
            "id": "pi_X9VclUOJ2VwLlcsrs9KdrMpeXWjKCTxe",
            "title": "SAMPLE PROJECT6",
            "preview": "https://cdn.svgator.com/project/N9/x0/2kKfkN3ekimlrqzrwVdKRlgXx38O/prv.svg",
            "created": 1605514740,
            "updated": 1605514740
        },
        {
            "id": "pi_2YMMsfECrw4QDihgjoS3OQIW4S83nJOL",
            "title": "SAMPLE PROJECT7",
            "preview": "https://cdn.svgator.com/project/Zj/Ld/QcoifFVCH6ggI4GPJugucKtFL3iy/prv.svg",
            "created": 1605272275,
            "updated": 1605272275
        },
        {
            "id": "pi_grb9FjA6igN0ugsh1lByOYyh6LCQLmMz",
            "title": "SAMPLE PROJECT8",
            "preview": "https://cdn.svgator.com/project/g0/k7/rNghDQLQy27XmXL6vwqEYap8GhY0/prv.svg",
            "created": 1605105791,
            "updated": 1605105792
        },
        {
            "id": "pi_xJaIYPWKnw7ai5litw7M7O1MhQf4a5r5",
            "title": "SAMPLE PROJECT9",
            "preview": "https://cdn.svgator.com/project/eR/qQ/KUcgvRuPpBQ6mTAynFSlGU1n8wQw/prv.svg",
            "created": 1605104247,
            "updated": 1605104248
        },
        {
            "id": "pi_HKRKtC6vW5vV9fyQzELBRLxFpWQQiY7S",
            "title": "SAMPLE PROJECT10",
            "preview": "https://cdn.svgator.com/project/2n/YG/jJPp1MZ7vFottUMPY9bp7jIunoJ5/prv.svg",
            "created": 1601885609,
            "updated": 1604595234
        },
        {
            "id": "pi_AAKJkugYp8PrY6SH9CT8VVpyueZZuqKD",
            "title": "SAMPLE PROJECT11",
            "preview": "https://cdn.svgator.com/project/Ui/vW/95El8v8Ekaiy2588WPiU4HwVYNRQ/prv.svg",
            "created": 1595931590,
            "updated": 1599216962
        },
        {
            "id": "pi_7iVLcdxaNIBuOsHSuw4ZeSp7HdzZPfPY",
            "title": "SAMPLE PROJECT12",
            "preview": "https://cdn.svgator.com/project/ar/kR/Jm9LeHtiBCQba4KfCDmD8VjTqbvb/prv.svg",
            "created": 1596198502,
            "updated": 1598276956
        },
        {
            "id": "pi_ZXLDabKF6VFvm3OIOCUbGltqYQQ4dxVG",
            "title": "SAMPLE PROJECT13",
            "preview": "https://cdn.svgator.com/project/xq/LN/x2ZtenthSmcmjveom4Sz5BTRUbPl/prv.svg",
            "created": 1595930112,
            "updated": 1595930112
        },
        {
            "id": "pi_0kmRESdFBrLpWtbtJrKNpRlr5o4EOIbS",
            "title": "SAMPLE PROJECT14",
            "preview": "https://cdn.svgator.com/project/zt/DO/TyG7OUdB6IwCd5GNr7zjCrgqYutM/prv.svg",
            "created": 1595929875,
            "updated": 1595929876
        },
        {
            "id": "pi_HdaWsFFkUDzbtsJLZVOcg7mg3SlZ47Dw",
            "title": "SAMPLE PROJECT15",
            "preview": "https://cdn.svgator.com/project/xJ/Xf/b0NoCQ3DfE36eHYAYSRU2djWbic4/prv.svg",
            "created": 1594025316,
            "updated": 1594025514
        }
    ]
}
```
Save both values for later usage. The given access token will allow you to retrieve all the SVGs for the given customer for a period of 6 months, or until the user revokes your permissions from their account settings.
<br>




<hr><br><br><br>








2. Retrieve some extra details about a project
     This is a server-to-server request & you have to use a `hash` parameter. For more details see the [How to make a BACKEND REQUEST](#how-to-make-a-backend-request) section.
    
     Required arguments for this request: `app_id`, `time`, `access_token`, `project_id`, `hash` <sup>[*param reference*](#url-parameters-for-backend-requests)</sup>
    
     Example URL:
     > https://app.local/api/app-auth/project?app_id=ai_abcd&time=123456&access_token=at_abcd&project_id=pi_abcd&hash=0123456789abcdef
    
     The response will have a `project` property, containing project details:
    
    ```
     {"project": {
        "id": "pi_abcd",
        "title": "abcd",
        "preview": "http://cdn.svgator.com/projects/...",
        "label": "some-label",
        ...
     }}
    ```

3. Retrieve the animated SVG (Exporting a project)
     This is a server-to-server request & you have to use a `hash` parameter. For more details see the [How to make a BACKEND REQUEST](#how-to-make-a-backend-request) section.
    
     Required arguments for this request: `app_id`, `time`, `access_token`, `project_id`, `hash` <sup>[*param reference*](#url-parameters-for-backend-requests)</sup>
    
     Example URL:
     > https://app.local/api/app-auth/export?app_id=ai_abcd&time=123456&access_token=at_abcd&project_id=pi_abcd&hash=0123456789abcdef
    
     The response will be raw text, containing the SVG data
    
    ```
     <svg id="egain0g46a2d1" ...>
        ...
        <script>...</script>
     </svg>
    ```




### URL parameters for backend requests
   
   |Parameter       |Description
   |:--------------:|---
   |`app_id`        |The application ID you got from SVGator (begins w/ `ai_`) 
   |`time`          |Current UNIX timestamp. A request can't be older than 5 minutes.
   |`hash`          |The hash built based on the description from section [How to make a BACKEND REQUEST](#how-to-make-a-backend-request)
   |`auth_code`     |The auth_code you got on the front-end after the user authorizes your application (begins w/ `ac_`)
   |`access_token`  |Identifier you got back when requested for /api/app-auth/token (begins w/ `at_`)
   |`customer_id`   |Identifier of the user (begins w/ `ci_`)
   |`project_id`    |Identifier of one project/svg (begins w/ `pi_`)

### Error handling for backend requests
     
On any kind of error, the response for your request has still HTTP status 200 & is in the following format:
```
{
    "error": "Here comes the error message",
    "error_description": "This is an optional description. Most of the cases this property is missing."
}
```

You should check all responses if it has the given structure or not & you should handle these errors.

You may recieve a HTTP status code other than 200 in cases where there is a networking issue (eg. our server is unreachable from your server)

## JavaScript FrontEnd SDK

Find documentation on:
[@svgator/sdk-backend](https://www.npmjs.com/package/@svgator/sdk-backend)

## JavaScript BackEnd SDK

Find documentation on:
[@svgator/sdk-frontend](https://www.npmjs.com/package/@svgator/sdk-frontend)
