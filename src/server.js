var server = require('http').createServer()
  , url = require('url')
  , express = require('express')
  , app = express()
  , port = 2000;


import { createStore,applyMiddleware } from 'redux';
import {reducer, actions} from './actions.js';

//create the store.
var store = createStore(reducer, {default:"default"} );

//start the sockets etc.
var reduxServer = require('./sync-redux-server.js')(store,server);

//bind redux server and express
app.use('/redux',reduxServer.getMiddleware());

//bind http and express
server.on('request', app);

server.listen(port, function () { console.log('Listening on ' + server.address().port) });
