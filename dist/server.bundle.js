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
	  /**
	   * Constructor of the server
	   *
	   * @param store
	   * @param server
	   */

	  function SyncReduxServer(store, server) {
	    var broadcastOnReceive = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	    var onConnectionCallback = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
	    var onPreSendCallback = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
	    var onActionReceived = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

	    _classCallCheck(this, SyncReduxServer);

	    /**
	     * Websocket Server
	     */
	    this.wss = new WebSocketServer({ server: server });

	    /**
	     * Redux store to link to the clients
	     */
	    this.store = store;

	    /**
	     * If true, will broadcast received action to all clients
	     * @type {boolean}
	     */
	    this.broadcastOnReceive = broadcastOnReceive;

	    /**
	     * Flag to know if the server must display debug
	     *
	     * @type {boolean}
	     */
	    this.debug = false;

	    /**
	     * After the connection of a new client,
	     * this function will be called if set
	     *
	     * @type {null}
	     */
	    this.onConnectionCallback = onConnectionCallback;

	    /**
	     * If set, will be called before sending a message
	     * If it return false the message will not be set
	     * @type {function(socket)}
	     */
	    this.onPreSendCallback = onPreSendCallback;

	    /**
	     * If set, will be called just after receiving an action
	     *
	     * @type {function(action, socket)}
	     */
	    this.onActionReceived = onActionReceived;

	    /**
	     * Bind the socket behavior
	     */
	    this.wss.on('connection', function connection(socket) {
	      if (this.onConnectionCallback !== null) {
	        this.onConnectionCallback(socket);
	      }
	      if (this.debug) {
	        console.log('Assigned id: ' + socket.id);
	      }
	      socket.on('message', function incoming(message) {
	        if (this.debug) {
	          console.log(message);
	        }
	        var action = JSON.parse(message);
	        if (this.onActionReceived !== null) {
	          action = this.onActionReceived.apply(this, [action, socket]);
	        }
	        if (this.debug) {
	          console.log('Action to dispatch: [%o]', action);
	        }
	        this.store.dispatch(action);
	        if (this.debug) {
	          console.log(store.getState());
	        }
	        if (this.broadcastOnReceive) {
	          this.broadcastToOtherClient(action);
	        }
	      }.bind(this));
	    }.bind(this));
	  }

	  /**
	   * Set the debug mode of the server
	   *
	   * @param debug
	   */


	  _createClass(SyncReduxServer, [{
	    key: 'setDebug',
	    value: function setDebug() {
	      var debug = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

	      this.debug = debug;
	    }

	    /**
	     * Return an express middleware
	     *
	     * @returns {*}
	     */

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

	    /**
	     * Send an action
	     * @param socket
	     * @param action
	     */

	  }, {
	    key: 'sendAction',
	    value: function sendAction(action, socket) {
	      if (this.onPreSendCallback !== null) {
	        if (!this.onPreSendCallback.apply(this, [action, socket])) {
	          return;
	        }
	      }
	      socket.send(JSON.stringify(action));
	    }

	    /**
	     * Find a socket searching for a property
	     * Return the last socket matching the property
	     *
	     * return null in case no socket are found
	     * @param value
	     * @param property
	     * @returns {socket|null}
	     */

	  }, {
	    key: 'getSocketByProperty',
	    value: function getSocketByProperty(value, property) {
	      var socketMatch = null;
	      this.wss.clients.forEach(function each(socket) {
	        if (socket[property] !== undefined && socket[property] === value) {
	          socketMatch = socket;
	        }
	      }.bind(this));
	      if (socketMatch === null && this.debug) {
	        console.log("Did not found any socket with [" + property + "] to [" + value + "]");
	      }
	      return socketMatch;
	    }

	    /**
	     * Broadcast a message to all clients
	     *
	     * @param action
	     * @param senderSocket
	     */

	  }, {
	    key: 'broadcastToOtherClient',
	    value: function broadcastToOtherClient(action) {
	      this.wss.clients.forEach(function each(socket) {
	        this.sendAction(action, socket);
	      }.bind(this));
	    }
	  }]);

	  return SyncReduxServer;
	}();

	;

	module.exports = function (store, server) {
	  var broadcastOnReceive = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	  var onConnectionCallback = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
	  var onPreSendCallback = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
	  var onActionReceived = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

	  return new SyncReduxServer(store, server, broadcastOnReceive, onConnectionCallback, onPreSendCallback, onActionReceived);
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