/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./svgator-frontend/browser.js":
/*!*************************************!*\
  !*** ./svgator-frontend/browser.js ***!
  \*************************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./svgator-frontend/index.js\");\n\n\n\nlet oldSVGator = window.SVGator;\n\n_index_js__WEBPACK_IMPORTED_MODULE_0__.default.noConflict = function(){\n    window.SVGator = oldSVGator;\n    return _index_js__WEBPACK_IMPORTED_MODULE_0__.default;\n};\n\nwindow.SVGator = _index_js__WEBPACK_IMPORTED_MODULE_0__.default;\n\n//# sourceURL=webpack://svgatorsdk/./svgator-frontend/browser.js?");

/***/ }),

/***/ "./svgator-frontend/index.js":
/*!***********************************!*\
  !*** ./svgator-frontend/index.js ***!
  \***********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _src_SVGatorOpener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/SVGatorOpener */ \"./svgator-frontend/src/SVGatorOpener.js\");\n\n\nclass SVGatorFrontend {\n    static async auth(appId, redirectUrl, endpoint) {\n        if (!endpoint) {\n            endpoint = 'https://app.svgator.com/app-auth';\n        } else {\n            endpoint = endpoint.replace(/\\/+$/ + '');\n        }\n        if (!redirectUrl) {\n            return await _src_SVGatorOpener__WEBPACK_IMPORTED_MODULE_0__.default.open(appId, endpoint)\n        }\n        let searchParams = new URLSearchParams();\n        searchParams.append('redirect', redirectUrl);\n        searchParams.append('appId', appId);\n        let url = endpoint + \"/connect?\" + searchParams.toString();\n        return window.open(url, \"_self\");\n    }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SVGatorFrontend);\n\n//# sourceURL=webpack://svgatorsdk/./svgator-frontend/index.js?");

/***/ }),

/***/ "./svgator-frontend/src/SVGatorOpener.js":
/*!***********************************************!*\
  !*** ./svgator-frontend/src/SVGatorOpener.js ***!
  \***********************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/**\n * @author Tibor Vincze\n * @date 10/1/2020 11:38 AM\n */\n\nclass SVGatorOpener {\n    static windowOptions(){\n        let opts = {\n            top: 100,\n            left: 100,\n            width: 500,\n            height: 700,\n            menu: 0\n        };\n\n        return Object.keys(opts).map((name)=>name + '=' + opts[name]).join(',');\n    }\n\n    static open(appId, endpoint){\n        return new Promise(function(resolve, reject){\n            let windowWatcher;\n            let msgSent = false;\n            function success(msg){\n                if (msgSent) {\n                    return;\n                }\n                msgSent = true;\n                if (windowWatcher) {\n                    clearInterval(windowWatcher);\n                    windowWatcher = false;\n                }\n                setTimeout(function() {\n                    resolve(msg);\n                }, 0);\n            }\n\n            function fail(data){\n                if (msgSent) {\n                    return;\n                }\n                msgSent = true;\n                if (windowWatcher) {\n                    clearInterval(windowWatcher);\n                    windowWatcher = false;\n                }\n                setTimeout(function() {\n                    reject(data);\n                }, 0);\n            }\n\n            try {\n                let url = endpoint + '/connect'\n                    + '?appId=' + encodeURIComponent(appId)\n                    + '&origin=' + encodeURIComponent(window.origin);\n                let w = window.open(url, '_blank', SVGatorOpener.windowOptions());\n\n                windowWatcher = setInterval(function(){\n                    if (w.closed) {\n                        fail({code: -4, msg: \"Authorization page closed\"});\n                    }\n                }, 100);\n\n                window.addEventListener('message', function(ev){\n                    try {\n                        let data = JSON.parse(ev.data);\n                        if (!data.code) {\n                            success(data.msg);\n                        } else {\n                            fail(data);\n                        }\n                    } catch(err) {\n                        fail({code: -2, msg: err});\n                    }\n                });\n            } catch(err) {\n                fail({code: -1, msg: err});\n            }\n        })\n    }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SVGatorOpener);\n\n//# sourceURL=webpack://svgatorsdk/./svgator-frontend/src/SVGatorOpener.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./svgator-frontend/browser.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;