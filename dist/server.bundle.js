!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("body-parser"),require("express"),require("ws")):"function"==typeof define&&define.amd?define(["body-parser","express","ws"],t):"object"==typeof exports?exports.ReduxShareServer=t(require("body-parser"),require("express"),require("ws")):e.ReduxShareServer=t(e["body-parser"],e.express,e.ws)}(this,function(e,t,n){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="/dist/",t(0)}([function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),r=n(3).Server,c=n(2),u=function(){function e(t,n,i){o(this,e),this.wss=new r({server:n}),this.store=t;var s={debug:!1,onConnection:null,onActionReceived:null,shouldSend:null,repeaterMode:!1};this.options=Object.assign({},s,i),this.wss.on("connection",function(e){"function"==typeof this.options.onConnection&&(e=this.options.onConnection(e)||e),e.on("message",function(t){this.log("Received from client the message ",t);var n=JSON.parse(t);"function"==typeof this.options.onActionReceived&&(n=this.options.onActionReceived.apply(this,[n,e])),this.log("Dispatching the action to the store",n),this.store.dispatch(n),this.options.broadcastMode&&this.broadcastAction(n,function(t){return t!==e})}.bind(this))}.bind(this))}return i(e,[{key:"log",value:function(){if(this.options.debug){var e;(e=console).log.apply(e,["redux-share-server: "].concat(Array.prototype.slice.call(arguments)))}}},{key:"getExpressMiddleware",value:function(){var e=c.Router();return e.use(s.urlencoded({extended:!1})),e.use(s.json()),e.post("/action",function(e,t){var n=e.body;this.log("Dispatching an action to the store",n),this.store.dispatch(n),this.broadcastAction(n),t.send(JSON.stringify({success:!0})),t.end()}.bind(this)),e.get("/state",function(e,t){t.send(JSON.stringify(this.store.getState(),null,4)),t.end()}.bind(this)),e}},{key:"findSockets",value:function(e,t){return this.wss.clients.filter(function(n){return void 0!==n[e]&&n[e]===t})}},{key:"broadcastAction",value:function(e){var t=arguments.length<=1||void 0===arguments[1]?null:arguments[1];return this.log("Dispatches an action to all clients",e),"function"!=typeof t&&(t=function(){return!0}),this.wss.clients.filter(t).map(function(t){return this.sendToAction(e,t)}.bind(this))}},{key:"sendToAction",value:function(e,t){var n=Object.assign({},e,{origin:"server"});if("function"!=typeof this.options.shouldSend||this.options.shouldSend.apply(this,[n,t]))return this.log("Dispatches an action to a client",n),t.send(JSON.stringify(n))}}]),e}();e.exports=u},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("ws")}])});
//# sourceMappingURL=server.bundle.js.map