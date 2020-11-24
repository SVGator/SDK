# SVGator API & SDK documentation

Using SVGator's SDKs (Software Development Kit) to interact with SVGator's API (Application Programming Interface) will allow your users to connect their SVG projects to your application.

Please note that we **strongly recommend the usage of the included SDKs** over direct API calls.

## Table of Contents

1. [Before You Start](#before-you-start)
2. [Fronend API](#api-logic--endpoint)
    - Authorize Access with Popup Window
    - Authorize Access with Redirect    
3. [API logic & endpoint](#api-logic--endpoint)
3. [Prepare connection between your app & SVGator](#prepare-connection-between-your-app--svgator)
4. [API actions](#api-actions)
5. [How to make a BACKEND REQUEST](#how-to-make-a-backend-request)
6. [URL parameters for backend requests](#url-parameters-for-backend-requests)
7. [Error handling for backend requests](#error-handling-for-backend-requests)
9. [JavaScript FrontEnd SDK](#javascript-frontend-sdk)
0. [JavaScript BackEnd SDK](#javascript-backend-sdk)

### Before You Start

In order to use SVGator's API & SDKs, one first must obtain an SVGator Application. To do so, please email [contact@svgator.com](mailto:contact@svgator.com?subject=SVGator%20Application%20Request&body=Dear%20Support%2C%0D%0A%0D%0AMy%20name%20is%20%5BJOHN%2FJANE%20DOE%5D%20from%20%5BCOMPANY%2C%20INC.%5D.%0D%0APlease%20add%20an%20SVGator%20application%20to%20my%20account%20of%20%5BEMAIL%40COMPANY.COM%5D%2C%20in%20order%20to%20offer%20my%20users%20to%20connect%20their%20SVGator%20accounts%20with%20my%20software.), providing your SVGator account ID and the desired usage of your SVGator application.

The API keys one should receive from contact@svgator.com are:
- The Application ID, used as "app_id" in requests, prefixed with "ai_", followed by 32 alphanumeric chars; i.e. `ai_b1357de7kj1j3ljd80aadz1eje782f2k`  
- Your Secret Key, prefixed with "sk_", followed by 32 alphanumeric chars; i.e. `sk_58ijx87f45596ylv5jeb1a5vicdd92i4`

**Attention**: Your Secret Key should never be present in any requests, neither be present on Front-End.

## API logic & endpoint

This section includes the full API specification for our system

All HTTP requests from your backend will go to a link starting with:
> https://app.svgator.com/api/app-auth/

On the front-end there's a single link that will be accessed by your user:
> https://app.svgator.com/app-auth/connect

Note the HTTPS protocol in both links. That's important.

### Prepare connection between your app & SVGator

1. Open the authentication page

     Open URL:
     > https://app.svgator.com/app-auth/connect?appId=APP_ID&redirect=URL
     
     The `APP_ID` parameter should be your application ID (the id that begins with "ai_")
    
     The `URL` should be the link where the user will be redirected after they authenticate (both on error or on success)
     
     The `URL` will also receive as argument the `auth_code` using which you will be able to obtain an `access_token` with a server-to-server request 
    
     The expiration time on the `auth_code` is 5 minutes
     
     *Notes:*
     - *URL has to use `HTTPS` as protocol, otherwise the user will see a confirmation box while he's redirected*
     - *We also provide a pop-up authentication using our JavaScript/Front-End SDK*
   
   **Obtain `auth_code` together with `app_id`**
   
   This feature is desired to be used mainly from applications with a single user access
   or from pages where the owner doesn't want to have control over the application itself
   This functionality is named dynamic app creation and involves the creation/retrieval of the `app_id` & `secret_key` together with the `auth_code`.
   
   An example for the implementation for this can be found inside our WordPress plugin.
   
   This process can be used with our pop-up authentication using our JavaScript/Front-End SDK
    
   Steps to follow:
   1. Open the authentication page with the `app_id` parameter filled with the value `dynamic`
      > https://app.svgator.com/app-auth/connect?appId=dynamic&redirect=URL
       
   2. When the user is redirected to your domain, the returning URL will have as parameter the `auth_code` and the `app_id`.
      
   3. Using the app_id & auth_code got, make a HTTP request from your backend to obtain the `access_token`.
      You should still generate the `hash` parameter, but simply skip the secret key from the end of the hashed string (step 3 from *How to generate the `hash`*)
      In the response you will get the `access_token` and the `secret_key` that can be used for any further requests, as defined later in this document.
      
   4. It's important to note, that once you ask for an auth_code using the dynamic app_id functionality, all previous auth_codes will be invalidated.
      However already issued access_tokens will remain functional.
      
   5. An application ID & secret key pair obtained with this process can't be used to ask for access to other user's profile. 
   
2. Obtain the `access_token`

     This is a server-to-server request & you have to use a `hash` parameter. For more details see the [How to make a BACKEND REQUEST](#how-to-make-a-backend-request) section.
    
     Required arguments for this request: `app_id`, `time`, `auth_code`, `hash` <sup>[*param reference*](#url-parameters-for-backend-requests)</sup>
    
     Example URL:
    > https://app.local/api/app-auth/token?app_id=ai_abcd&time=123456&auth_code=ac_abcd&hash=0123456789abcdef
    
     The response will have an `access_token` and a `customer_id` inside it:
    ```
    {
        "access_token": "at_abcd",
        "customer_id": "ci_abcd"
    }
    ```
    
     Save both of them for later usage. The given access token will allow you to retrieve all the SVGs for the given customer for a period of 6 months, or until the user revokes your permissions from their account settings.
     
### API actions
     
1. Retrieve the list of projects from the user (all SVGs he has)
     This is a server-to-server request & you have to use a `hash` parameter. For more details see the [How to make a BACKEND REQUEST](#how-to-make-a-backend-request) section.
    
     Required arguments for this request: `app_id`, `time`, `access_token`, `customer_id`, `hash` <sup>[*param reference*](#url-parameters-for-backend-requests)</sup>
    
     Example URL:
     > https://app.local/api/app-auth/projects?app_id=ai_abcd&time=123456&access_token=at_abcd&customer_id=ci_abcd&hash=0123456789abcdef
    
     The response will have a `projects` property, containing an array of projects:
       
    ``` {
       "projects": [
           {"id": "pi_abcd", "title": "abcd", "updated": 123456, ...},
           {"id": "pi_efgh", "title": "abcd", "updated": 123456, ...},
           ...
       ]
     }
    ```

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

### How to make a BACKEND REQUEST
Any request you make from your server to our server has to contain a `hash` parameter.
Below you will see how can you generate the `hash` parameter.

Variables that you will need:
1. `app_id` - your application ID
2. `time` - current unix timestamp
3. `secret_key` - your app's secret key __DO NOT SEND THIS ARGUMENT IN THE URL!__
4. Any other required argument depending on the action requested

__How to generate the `hash`__
1. Sort the arguments by their name, alphabetically (`secret_key` is not included here)
    > ?`time`=123456&`app_id`=ai_abcd&`auth_code`=ac_abcd
    >
    > =>
    >
    > ?`app_id`=ai_abcd&`auth_code`=ac_abcd&`time`=123456
    
2. Concatenate the value of the parameters, in this (alphabetically sorted) order
    > ?app_id=`ai_abcd`&auth_code=`ac_abcd`&time=`123456`
    >
    > =>
    >
    > `ai_abcdac_abcd123456`

3. Concatenate to the end of the received string you secret key as well (the string that begins w/ `sk_` 
    > ai_abcdac_abcd123456
    >
    > =>
    >
    > ai_abcdac_abcd123456sk_abcd *(assuming your secret_key is "sk_abcd")*
    
4. Generate the sha256 of the received string (this is the `&hash=` parameter
    > ai_abcdac_abcd123456sk_abcd
    > 
    > =>
    >
    > dd7641f59a809a7c0e8db2079853d35a561d9f8752e266b2e20f1355f086e516
    
5. Append the received `&hash=` parameter to the original link & make the request
    > ?`time`=123456&`app_id`=ai_abcd&`auth_code`=ac_abcd
    >
    > =>
    >
    > ?`time`=123456&`app_id`=ai_abcd&`auth_code`=ac_abcd&`hash`=dd7641f59a809a7c0e8db2079853d35a561d9f8752e266b2e20f1355f086e516

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
