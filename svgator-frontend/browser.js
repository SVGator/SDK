const SVGatorFrontend = require("./index.js");

let _global = {};
if (typeof(self) !== 'undefined') {
    _global = self;
} if (typeof(window) !== 'undefined') {
    _global = window;
} else if (typeof(global) !== 'undefined') {
    _global = global;
}

let oldSVGator = _global.SVGator;

SVGatorFrontend.noConflict = function() {
    _global.SVGator = oldSVGator;
    return SVGatorFrontend;
};

_global.SVGator = SVGatorFrontend;
