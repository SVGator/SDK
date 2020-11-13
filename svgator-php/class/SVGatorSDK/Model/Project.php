<?php

namespace SVGatorSDK\Model;

class Project {
	public $id;
	public $title;
	public $preview;
	public $created;
	public $updated;

	public function __construct($params = []) {
		$this->populate($params);
	}

	public function populate($params = []) {
		foreach($params as $key => $value) {
			try {
				$this->{$key} = $value;
			} catch(\Exception $e) {
			}
		}
	}
}
