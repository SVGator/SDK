<?php
/**
 * Autoloader for SVGator's PHP SDK
 *
 * https://www.svgator.com/
 */
spl_autoload_register('SVGatorSDK_autoloader');

function SVGatorSDK_autoloader($className) {
	$className = str_replace('\\', DIRECTORY_SEPARATOR, $className);

	if(strpos($className, 'SVGatorSDK') === false) {
		return false;
	}

	$classes_dir = __DIR__
	               . DIRECTORY_SEPARATOR
	               . 'class'
	               . DIRECTORY_SEPARATOR;

	$class_file = $className . '.php';

	if(!file_exists($classes_dir . $class_file)) {
		return false;
	}

	require_once $classes_dir . $class_file;
}
