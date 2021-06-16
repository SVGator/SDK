<?php

namespace SVGatorSDK;

class Main {
	public function __construct($params = []) {
		$req = Request::getInstance();
		$req->setAppParams($params);
	}

	/**
	 * @param string $appId
	 * @param $redirectUrl
	 *
	 * @return string
	 */
    public static function getLoginUrl($appId, $redirectUrl) {
        $host = 'https://app.svgator.com';
        if (in_array(@$_SERVER['HTTP_HOST'], ['wp.local', 'localhost:8081'], true)) {
            $host = 'https://app.svgator.net';
        } elseif (strpos(@$_SERVER['HTTP_HOST'], '.svgator.net') !== false) {
            $host = 'http://app-svgator2';
        }

        return $host
            . '/app-auth/connect'
            . '?appId=' . urlencode($appId)
            . '&redirect=' . urlencode($redirectUrl);
    }

	/**
	 * @param string $auth_code
	 *
	 * @return mixed
	 * @throws \Exception
	 */
	public function getAccessToken($auth_code) {
		$result = Request::getInstance()->makeRequest(Request::ENTITY_TOKEN, [
			'app_id' => Request::getInstance()->getKey('app_id'),
			'auth_code' => $auth_code,
		]);
		Request::getInstance()->setAppParams($result);

		return $result;
	}

	/**
	 * @return \SVGatorSDK\Projects
	 */
	public function projects() {
		static $project = null;

		if(!$project) {
			$project = Projects::getInstance();
		}

		return $project;
	}
}
