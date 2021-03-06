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

		$projects = [];
		foreach($json['projects'] as $jsonProject) {
			$project = new Model\Project($jsonProject);
			$projects[$project->id] = $project;
		}


		return array_values($projects);
	}

	/**
	 * @param int $project_id ID of the project you want to export
	 *
	 * @return string SVG of the requested project
	 * @throws \Exception
	 */
	public function export($project_id) {
		return Request::getInstance()->makeRequest(Request::ENTITY_EXPORT, [
			'project_id' => $project_id,
		], 'text');
	}
}
