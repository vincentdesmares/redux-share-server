(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("body-parser"), require("ws"), require("express"));
	else if(typeof define === 'function' && define.amd)
		define(["body-parser", "ws", "express"], factory);
	else if(typeof exports === 'object')
		exports["ReduxShareServer"] = factory(require("body-parser"), require("ws"), require("express"));
	else
		root["ReduxShareServer"] = factory(root["body-parser"], root["ws"], root["express"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bodyParser = __webpack_require__(1);
	var WebSocketServer = __webpack_require__(2).Server;
	var express = __webpack_require__(3);

	var SyncReduxServer = function () {
	  function SyncReduxServer(store, server) {
	    _classCallCheck(this, SyncReduxServer);

	    this.wss = new WebSocketServer({ server: server });
	    this.store = store;
	    this.broadcastOnReceive = false;
	    this.debug = false;
	    this.wss.on('connection', function connection(socket) {
	      socket.id = Math.random() * 9999999 + '';
	      if (this.debug) {
	        console.log('Assigned id: ' + socket.id);
	      }
	      socket.on('message', function incoming(message) {
	        console.log(message);
	        var action = JSON.parse(message);
	        action.senderId = socket.id;
	        this.store.dispatch(action);
	        if (this.debug) {
	          console.log(store.getState());
	        }
	        if (this.broadcastOnReceive) {
	          this.broadcastToOtherClient(action, socket);
	        }
	      }.bind(this));
	    }.bind(this));
	  }

	  _createClass(SyncReduxServer, [{
	    key: 'setDebug',
	    value: function setDebug() {
	      var debug = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

	      this.debug = debug;
	    }
	  }, {
	    key: 'setBroadcastOnReceive',
	    value: function setBroadcastOnReceive(broadcast) {
	      this.broadcastOnReceive = broadcast;
	    }
	  }, {
	    key: 'getMiddleware',
	    value: function getMiddleware() {
	      var router = express.Router();

	      router.use(bodyParser.urlencoded({ extended: false }));
	      router.use(bodyParser.json());

	      router.post('/action', function (req, res) {
	        if (this.debug) {
	          console.log("Dispatches an action to all clients", req.body);
	        }
	        this.spread(req.body);
	        res.send(JSON.stringify({ success: true }));
	        res.end();
	      }.bind(this));

	      router.get('/state', function (req, res) {
	        res.send(JSON.stringify(this.store.getState(), null, 4));
	        res.end();
	      }.bind(this));

	      return router;
	    }
	  }, {
	    key: 'broadcastToOtherClient',
	    value: function broadcastToOtherClient(action, senderSocket) {
	      this.wss.clients.forEach(function each(client) {
	        if (client.id !== senderSocket.id && action.type !== '@@SYNC-CONNECT-SERVER-END') {
	          client.send(JSON.stringify(action));
	        }
	      });
	    }
	  }]);

	  return SyncReduxServer;
	}();

	;

	module.exports = function (store, server) {
	  return new SyncReduxServer(store, server);
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("ws");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ }
/******/ ])
});
;