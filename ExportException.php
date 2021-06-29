<?php

namespace SVGatorSDK;

use Exception, Throwable;

class ExportException extends Exception
{
    protected $data;

    public function __construct($message = null, $code = 0, Throwable $previous = null, $data = null) {
        $this->data = $data;
        parent::__construct($message, $code, $previous);
    }

    // custom string representation of object
    public function __toString() {
        return parent::__toString() . var_export($this->data, true);
    }

    final public function getData() {
        return $this->data;
    }
}
