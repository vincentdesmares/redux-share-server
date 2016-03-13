# redux-share
Share redux state across the network between multiple clients and server!


## Server

Here is the code to integrate the server side with express:


```javascript
//server.js

//start the socket server
var syncReduxServer = require('./sync-redux-server.js')(store,server);

//bind redux server and express
app.use('/redux',syncReduxServer.getMiddleware());

```


## Client

The client a bit more complex, as your need to sync your state with the server upon connection.

```javascript
//client.js

var syncReduxClient = new SyncReduxClient('ws://localhost:2000');

//apply the middleware
store = createStore(reducer,applyMiddleware(syncReduxClient.getClientMiddleware()));

//open a socket to the server, then dump the state to the server
store.dispatch({type:"@@SYNC-CONNECT"});


```

## Example of a reducer on the server to handle client connection

```javascript
function reducer(state = {} , action) { 
	if(action.type === "@@SYNC-SERVER-DUMP") return action.state;
}

```

## List of special actions (client)

* @@SYNC-SERVER-DUMP: called on the client after the connection is successful, with the state in the payload. It will replace on the server side the current state.
* @@SYNC-CONNECT: called on the client to init state synchronization.


# API Endpoints (server)

* /redux/state: GET, POST read or erase the state.
* /redux/action: POST an action.
