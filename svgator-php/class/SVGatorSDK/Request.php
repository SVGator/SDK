<?php

namespace SVGatorSDK;

class Request {
	private static $instance = null;

	private $endpoint = 'https://app.svgator.com/api/app-auth/';
	const ENTITY_TOKEN = 'token';
	const ENTITY_PROJECT = 'project';
	const ENTITY_PROJECTS = 'projects';
	const ENTITY_EXPORT = 'export';

	private $app_id;
	private $secret_key;
	private $customer_id;
	private $access_token;

	private $_defaults = [
		'method'      => 'GET',
		'timeout'     => 10,
		'redirection' => 5,
		'httpversion' => '1.0',
		'blocking'    => true,
		'headers'     => [],
		'body'        => null,
		'cookies'     => [],
	];

	private function __construct() {
	}

	public function getKey($name) {
		if (!empty($this->{$name})) {
			return $this->{$name};
		}

		return null;
	}

	/**
	 * @return self
	 */
	public static function getInstance() {
		if(static::$instance === null) {
			static::$instance = new self();
		}

		return static::$instance;
	}

	/**
	 * @param array $params
	 *
	 * @return null
	 */
	public function setAppParams($params = []) {
		$keys = [
			'endpoint',
			'app_id',
			'secret_key',
			'customer_id',
			'access_token',
		];

		foreach($keys as $key) {
			if(!empty($params[$key])) {
				$this->{$key} = $params[$key];
			}
		}
	}

	private function isValidEntity($entity) {
		$oClass    = new \ReflectionClass(__CLASS__);
		$constants = $oClass->getConstants();
		foreach($constants as $key => $value) {
			if(strpos($key, 'ENTITY_') === 0 && $entity === $value) {
				return true;
			}
		}

		return false;
	}

	private function getHash($params) {
		ksort($params);
		$hash = implode('', $params);
		if (!empty($this->secret_key)) {
			$hash .= $this->secret_key;
		}

		return hash('sha256', $hash);
	}

	private function mergeArgs($args) {
		if(is_array($args)) {
			return array_merge($this->_defaults, $args);
		}

		return array_merge($this->_defaults, []);
	}

	private function setUserAgent(&$args) {
		if(!empty($args['headers']['User-Agent'])) {
			$args['user-agent'] = $args['headers']['User-Agent'];
		} elseif(!empty($args['headers']['user-agent'])) {
			$args['user-agent'] = $args['headers']['user-agent'];
		}
	}

	public function makeRequest($entity, $params = [], $type = 'json') {
		if(!$this->isValidEntity($entity)) {
			throw new \Exception('Invalid entity');
		}

		$time = time();
		if(!empty($this->app_id)) {
			$params['app_id'] = $this->app_id;
		}
		if(!empty($this->customer_id)) {
			$params['customer_id'] = $this->customer_id;
		}
		if(!empty($this->access_token)) {
			$params['access_token'] = $this->access_token;
		}
		$params['time'] = $time;

		$req = Request::getInstance();

		$endpoint = $this->endpoint;
		if (!empty($params['endpoint'])) {
			$endpoint = $params['endpoint'];
		}

		$url = $endpoint . $entity
		       . '?' . http_build_query($params)
		       . '&hash=' . $this->getHash($params);

		$res = $req->make($url);

		if($type === 'text') {
			return $res;
		}

		$json = json_decode($res, true);

		if(!$json) {
			throw new \Exception($res);
		}

		if(!empty($json['error'])) {
			throw new \Exception($json['error']);
		}

		return $json;
	}

	public function make($url, $args = []) {
		$mergedArgs = $this->mergeArgs($args);
		$this->setUserAgent($mergedArgs);

		$timeout = (int) ceil($mergedArgs['timeout']);

		$handle = curl_init();
		curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, $timeout);
		curl_setopt($handle, CURLOPT_TIMEOUT, $timeout);

		curl_setopt($handle, CURLOPT_URL, $url);
		curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

		curl_setopt($handle, CURLOPT_FOLLOWLOCATION, false);
		curl_setopt($handle, CURLOPT_PROTOCOLS, CURLPROTO_HTTP | CURLPROTO_HTTPS);

		switch($mergedArgs['method']) {
			case 'HEAD':
				curl_setopt($handle, CURLOPT_NOBODY, true);
				break;
			case 'POST':
				curl_setopt($handle, CURLOPT_POST, true);
				curl_setopt($handle, CURLOPT_POSTFIELDS, $mergedArgs['body']);
				break;
			case 'PUT':
				curl_setopt($handle, CURLOPT_CUSTOMREQUEST, 'PUT');
				curl_setopt($handle, CURLOPT_POSTFIELDS, $mergedArgs['body']);
				break;
			default:
				curl_setopt($handle, CURLOPT_CUSTOMREQUEST, $mergedArgs['method']);
				if(!is_null($mergedArgs['body'])) {
					curl_setopt($handle, CURLOPT_POSTFIELDS, $mergedArgs['body']);
				}
				break;
		}

		curl_setopt($handle, CURLOPT_HEADER, false);

		if(!empty($mergedArgs['headers'])) {
			// cURL expects full header strings in each element.
			$headers = [];
			foreach($mergedArgs['headers'] as $name => $value) {
				$headers[] = "{$name}: $value";
			}
			curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
		}

		if('1.0' === $mergedArgs['httpversion']) {
			curl_setopt($handle, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
		} else {
			curl_setopt($handle, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
		}

		curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, 2);
		curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 1);

		$output = curl_exec($handle);

		if(curl_errno($handle)) {
			throw new \Exception(curl_error($handle));
		}

		$httpCode = intval(curl_getinfo($handle, CURLINFO_HTTP_CODE));
		if($httpCode / 100 !== 2) {
			throw new \Exception('The script did not run successfully.');
		}

		curl_close($handle);

		return $output;
	}
}
