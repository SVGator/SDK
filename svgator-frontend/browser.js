
import SVGatorFrontend from "./index.js";

let oldSVGator = window.SVGator;

SVGatorFrontend.noConflict = function(){
    window.SVGator = oldSVGator;
    return SVGatorFrontend;
};

window.SVGator = SVGatorFrontend;