# PHP SDK

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

#### How to obtain `access_token` and `customer_id`

In order to obtain these, you will first need to [obtain an `auth_code` (and an `app_id`, if you don't already have one)](https://github.com/SVGator/SDK/blob/master/README.md#prepare-connection-between-your-app--svgator).


You can generate the login URL from the `SVGatorSDK\Main` class by passing an `app_id` and a `redirect_url`. If you don't have an `app_id`, you can just pass `dynamic`<sup>[[see limitations]]([https://github.com/SVGator/SDK/blob/master/README.md#prepare-connection-between-your-app--svgator)</sup> and one will be provided for you in the response.

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
