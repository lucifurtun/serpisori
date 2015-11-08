
function sendCoordinates(o) {
    var coordinates = {
        beta: o.beta,
        gamma: o.gamma
    };

    updater.socket.send(JSON.stringify(coordinates));
}

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/chatsocket";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
        };
        updater.socket.onopen = function () {
            updater.socket.send(JSON.stringify({
                "type": "join"
            }))
        };
        updater.socket.onclose = function () {
            updater.socket.send(JSON.stringify({
                "type": "leave"
            }))
        };
    }
};

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var toggle = document.querySelector(".toggle-sidebar");
	var target = document.querySelector(".sidebar");
	if(toggle && target) {
	    toggle.addEventListener("click", function(ev) {
	        if(target.className.indexOf('show') === -1) {
	            target.className += ' show';
	        } else {
	            target.className = target.className.replace('show', '');
	        }
	        ev.preventDefault();
	    });
	}

	if(document.querySelector("#hitarea")) {
	    __webpack_require__(1);
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	* kind of messy code, but good enough for now
	*/
	// polyfill
	var reqAnimationFrame = (function () {
	    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
	        window.setTimeout(callback, 1000 / 60);
	    };
	})();

	var screen = document.querySelector(".device-screen");
	var el = document.querySelector("#hitarea");

	var START_X = Math.round((screen.offsetWidth - el.offsetWidth) / 2);
	var START_Y = Math.round((screen.offsetHeight - el.offsetHeight) / 2);

	var ticking = false;
	var transform;
	var timer;

	var mc = new Hammer.Manager(el);

	mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
	mc.on("panstart panmove", onPan);

	mc.on("hammer.input", function(ev) {
	    if(ev.isFinal) {
	        resetElement();
	    }
	});

	function logEvent(ev) {
	    //el.innerText = ev.type;
	}

	function resetElement() {
	    el.className = 'animate';
	    transform = {
	        translate: { x: START_X, y: START_Y },
	        scale: 1,
	        angle: 0,
	        rx: 0,
	        ry: 0,
	        rz: 0
	    };
	    requestElementUpdate();
	}

	function updateElementTransform() {
	    var value = [
	        'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
	        'scale(' + transform.scale + ', ' + transform.scale + ')',
	        'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
	    ];

	    value = value.join(" ");
	    el.style.webkitTransform = value;
	    el.style.mozTransform = value;
	    el.style.transform = value;
	    ticking = false;
	}

	function requestElementUpdate() {
	    if(!ticking) {
	        reqAnimationFrame(updateElementTransform);
	        ticking = true;
	    }
	}

	function onPan(ev) {
	    el.className = '';
	    transform.translate = {
	        x: START_X + ev.deltaX,
	        y: START_Y + ev.deltaY
	    };

        console.log(ev.deltaX, ev.deltaY);
        //console.log(transform.translate.x, transform.translate.y);

        output = {
            beta: ev.deltaX,
            gamma: -ev.deltaY,
        };
	    logEvent(ev);
	    requestElementUpdate();
	}


    resetElement();
    updater.start();
    var output = {
        beta: 0,
        gamma: 0,
    };

    setInterval(function(){
        sendCoordinates(output);
    }, 100);


/***/ }
/******/ ])
