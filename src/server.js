var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , port = 2000;

var bodyParser = require('body-parser')

import { createStore,applyMiddleware } from 'redux'
import {reducer, actions} from './actions.js'
var store = createStore(reducer);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post('/dispatch-to-all', function (req, res) {
  console.log("Dispatching an action to all",req.body);      // your JSON
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(req.body));
  });
  res.send("DONE");
});


wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);

  ws.on('message', function incoming(message) {
    console.log(message);
    let action = JSON.parse(message);
    store.dispatch(action);
    console.log(store.getState());
  });

});


server.on('request', app);

server.listen(port, function () { console.log('Listening on ' + server.address().port) });
