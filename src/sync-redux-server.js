var bodyParser = require('body-parser');
var WebSocketServer = require('ws').Server;
var express = require('express');


class SyncReduxServer {
  constructor(server) {
    this.wss = new WebSocketServer({ server: server });
    this.wss.on('connection', function connection(socket) {
      socket.on('message', function incoming(message) {
        console.log(message);
        let action = JSON.parse(message);
        store.dispatch(action);
        console.log(store.getState());
      });

    });
  }

  getMiddleware(store) {
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
      });

      router.get('/state', function (req,res) {
        res.send(JSON.stringify(store.getState(), null, 4));
        res.end();
      });

      router.post('/state',function(req,res) {
        console.log("Erasing the state.");
        store.dispatch({type:'@@SYNC-SERVER-DUMP',state:req.body});
      });
      return router;
  }

};

module.exports = function(server) {return new SyncReduxServer(server)};