export default class SyncStore {
	constructor(url) {
		this.url = url;
		this.readyToSend = false
	}

	init(store) {
		this.ws = new WebSocket(this.url);
		this.store = store;
		this.ws.onopen = function() {
			console.log("Sync connected!");
			//send a state dump
			this.readyToSend = true;
			let state = this.store.getState() || {};
			this.store.dispatch({type:"@@SYNC-SERVER-DUMP",state:state});
		}.bind(this);

		this.ws.onmessage =  event => {
			console.log("Sync: Received some stuff from the server",event.data);
			this.store.dispatch(JSON.parse(event.data));
		}
		this.ws.onclose = () => setTimeout(this.init.bind(this),1000);
	}

	send(action) {
		this.ws.send(JSON.stringify(action));
	}

	getClientMiddleware() {
		return store => next => action => {
  				//need to enrich next action.
  				console.log('Sync: dispatching ', action)
  				let result = next(action)
  				if(this.readyToSend) this.send(action);
  				if(action.type === "@@SYNC-CONNECT") this.init(store);
  				return result;
		}
	}
}