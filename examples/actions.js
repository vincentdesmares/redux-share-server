//reducers
export function reducer(state = {} , action) { 
		if(action.type === "MOVE_TO") {
			return Object.assign({},state,{
					playerId:action.playerId,
					x:action.x,
					y:action.y
					});
		}
		if(action.type === "@@SYNC-CONNECT-SERVER-END") return action.state;
		
		return state;
};

//action creators
export const actions = {
 moveTo: (playerId,x,y) => ({type:"MOVE_TO", playerId, x, y})

}