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
	public static function getLoginUrl($appId, $redirectUrl, $appName = null) {
        $queryParams = [
            'appId'    => $appId,
            'redirect' => $redirectUrl,
        ];
        if ($appName) {
            $queryParams['app_name'] = $appName;
        }
        return 'https://app.svgator.com/app-auth/connect?' . http_build_query($queryParams);
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
