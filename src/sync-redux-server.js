var bodyParser = require('body-parser');
var WebSocketServer = require('ws').Server;
var express = require('express');


class SyncReduxServer {
  constructor(store,server) {
    this.wss = new WebSocketServer({ server: server });
    this.store = store;
    this.wss.on('connection', function connection(socket) {
      socket.on('message', function incoming(message) {
        console.log(message);
        let action = JSON.parse(message);
        this.store.dispatch(action);
        console.log(store.getState());
      }.bind(this));

    }.bind(this));
  }

  getMiddleware() {
      var router = express.Router();

      router.use(bodyParser.urlencoded({ extended: false }));
      router.use(bodyParser.json())

      router.post('/action', function (req, res) {
        console.log("Dispatches an action to all clients",req.body);
        this.wss.clients.forEach(function each(client) {
          client.send(JSON.stringify(req.body));
        });
        res.send(JSON.stringify({success:true}));
        res.end();
      }.bind(this));

      router.get('/state', function (req,res) {
        res.send(JSON.stringify(this.store.getState(), null, 4));
        res.end();
      }.bind(this));
      
      return router;
  }

};

module.exports = function(store,server) {return new SyncReduxServer(store,server)};