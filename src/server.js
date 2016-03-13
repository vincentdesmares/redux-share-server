var server = require('http').createServer()
  , url = require('url')
  , express = require('express')
  , app = express()
  , port = 2000;


import { createStore,applyMiddleware } from 'redux';
import {reducer, actions} from './actions.js';

var store = createStore(reducer, {default:"default"} );

var reduxServer = require('./sync-redux-server.js')(server);

//var  = new SyncReduxServer(server);

app.use('/redux',reduxServer.getMiddleware(store));

server.on('request', app);

server.listen(port, function () { console.log('Listening on ' + server.address().port) });
