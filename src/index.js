import React from "react";
import { render } from "react-dom";
import { connect,Provider } from 'react-redux';
import { createStore,applyMiddleware } from 'redux'
import {reducer, actions} from './actions.js'
import Button from 'react-button';
import SubComponent from './sub-component.js';

//middleware code
const serverSync = store => next => action => {
  //need to enrich next action.
  console.log('dispatching ', action)
  let result = next(action)
  console.log('next state', store.getState())
  //ship action to the server...

  return result
}



//init
var store = createStore(reducer,applyMiddleware(serverSync));

window.store = store;

class Main extends React.Component {

	render() {
		return  <div> Hello World
					<Button onClick={ () => store.dispatch(actions.moveTo(1,1,1)) }>
						First position
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