# SVGator's PHP SDK for SVGator API

## Requirements

- PHP ^5.4
- cURL

### Usage

#### Autoload
Include `autoload.php` inside your project.

i.e.
```php
require_once('autoload.php');
```

## Before You Start

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


Creating an application on the fly is also possible using [`appId=dynamic`](../../master/README.md#2iii-dynamic-app-creation), yet this feature comes with restrictions. For a multi-user implementation follow the steps above instead.

#### How to obtain `access_token` and `customer_id`

In order to obtain these, you will first need to [obtain an `auth_code`](../../master/svgator-frontend/example.html) (and an `app_id`, if you don't already have one) from the [Frontend API](../../master/svgator-frontend/README.md).

You can generate the login URL from the `SVGatorSDK\Main` class by passing an `app_id` and a `redirect_url`. If you don't have an `app_id`, you can just pass `dynamic`<sup>[see limitations](../../master/README.md#3ii-obtain-an-access_token-for-a-dynamic-app)</sup> and one will be provided for you in the response.

```php
$app_id = 'dynamic'; //or the actual app_id you have
$redirect_url = 'https://example.com/';
$loginUrl = \SVGatorSDK\Main::getLoginUrl($app_id, $redirect_url);
```

Once you got those, you need to pass the `app_id` to the `SVGatorSDK\Main` class and call the `getAccessToken` with the `auth_code`.

If the request is successful, the method will return an array with the following keys, which you should save:
- `access_token`
- `customer_id`
- `app_id`
- `secret_key` - only if it wasn't already provided to the class' constructor

```php
$auth_code = 'ac...';
$svgator_keys = array(
	'app_id' => 'ai...'
);
$svgator_app = new \SVGatorSDK\Main($svgator_keys);
$data = $svgator_app->>getAccessToken($auth_code);
```

#### How to work with the SVGatorSDK\Main class

You will need to create a `SVGatorSDK\Main` object by passing an array - having the 4 keys mentioned earlier.

```php
$svgator_keys = array(
    'app_id'      => 'ai...',
    'secret_key' => 'sk...',
    'access_token' => 'at...',
    'customer_id' => 'ci...',
);

$svgator_app = new \SVGatorSDK\Main($svgator_keys);
```

#### How to get the project list

Call the `getAll` method (no params necessary).

It will return an indexed array of `SVGatorSDK\Model\Project` objects. Each of these objects contain the following properties:
- `id` - ID of the project
- `title` - the title of the project
- `preview` - a URL where one can preview the SVG
- `created` - UNIX timestamp when the project was created
- `updated` - UNIX timestamp when the project was last updated

```php
$svgator_app->projects()->getAll();
```

#### How to get a single project details

Call the `get` method, passing the project's ID as a parameter.

It will return a `SVGatorSDK\Model\Project` object, described in the previous section.
```php
$svgator_app->projects()->get($project_id);
```

#### How to get the SVG for a project

Call the `export` method, passing the project's ID as a parameter.
It will return the SVG of the requested project.

```php
$svgator_app->projects()->export($project_id);
```
