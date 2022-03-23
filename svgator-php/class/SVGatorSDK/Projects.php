<?php

namespace SVGatorSDK;

class Projects {
	private static $instance = null;

	private $projects = [];

	private function __construct() {
	}

	public static function getInstance() {
		if (static::$instance === null) {
			static::$instance = new self();
		}

		return static::$instance;
	}

	/**
	 * @param int $project_id ID of the project you want to get details about.
	 *
	 * @return \SVGatorSDK\Model\Project
	 * @throws \Exception
	 */
	public function get($project_id) {
		if (!isset($this->projects[$project_id])) {
			$json = Request::getInstance()->makeRequest(Request::ENTITY_PROJECT, [
				'project_id' => $project_id,
			]);

			$this->projects[$project_id] = new Model\Project($json['project']);
		}

		return $this->projects[$project_id];
	}

	/**
	 * @return array An array of \SVGatorSDK\Model\Project objects
	 * @throws \Exception
	 */
	public function getAll() {
		$json = Request::getInstance()->makeRequest(Request::ENTITY_PROJECTS);

		if (!$json || !is_array($json) || !isset($json['projects'])) {
			throw new \Exception('Could not retrieve projects.');
		}

		foreach($json['projects'] as $idx => $jsonProject) {
            $json['projects'][$idx] = new Model\Project($jsonProject);
		}

		return $json;
	}

	/**
	 * @param int $project_id ID of the project you want to export
	 * @param string|null $platform (optional) The platform for which you want to export. It must be one of the following strings: 'web', 'react-native', 'flutter'; will default to the project's setting if not set
	 *
	 * @return array SVG of the requested project + export limits
	 * @throws \Exception
	 */
	public function export($project_id, $platform = null) {
		if (!empty($platform)) {
			if (!in_array($platform, ['web', 'react-native', 'flutter'])) {
				throw new \Exception('Platform must be "web", "react-native" or "flutter".');
			}
		}

		$params = [
			'project_id' => $project_id,
			'format' => 'json',
		];

		if (!empty($platform)) {
			$params['platform'] = $platform;
		}

		return Request::getInstance()->makeRequest(Request::ENTITY_EXPORT, $params);
	}
}
