import React from "react"
import { render } from "react-dom"
import { connect,Provider } from 'react-redux'
import { createStore,applyMiddleware } from 'redux'
import {reducer, actions} from './actions.js'
import Button from 'react-button'
import SubComponent from './sub-component.js'

import SyncReduxClient from 'redux-client';

var store;

var client = SyncReduxClient('ws://localhost:2000');

//init
store = createStore(reducer,applyMiddleware(client.getClientMiddleware()));

store.dispatch({type:"@@SYNC-CONNECT-SERVER-START"});


class Main extends React.Component {

	render() {
		return  <div> Hello World <br />
					<Button onClick={ () => store.dispatch(actions.moveTo(1,1,1)) }>
						1 1 1
					</Button>
					<SubComponent />
			    </div>;
	}
}

Main = connect()(Main);

render(
<Provider store={store}>
	<Main/>
</Provider>, document.getElementById("root"));