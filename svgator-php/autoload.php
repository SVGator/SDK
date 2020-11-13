<?php
/**
 *
 */
spl_autoload_register('SVGator_autoloader');

function SVGator_autoloader($className) {
	$className = str_replace('\\', DIRECTORY_SEPARATOR, $className);
	if(strpos($className, 'SVGator') >= 0) {
		$classes_dir = __DIR__
		               .DIRECTORY_SEPARATOR
		               .'class'
		               .DIRECTORY_SEPARATOR;

		$class_file = $className.'.php';

		if(file_exists($classes_dir.$class_file)) {
			require_once $classes_dir.$class_file;

			return true;
		}

		return false;
	}
}
