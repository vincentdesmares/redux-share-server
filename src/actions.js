//reducers
export function reducer(state,action) { 
		if(action.type === "MOVE_TO") return {
			playerId:action.playerId,
			x:action.x,
			y:action.y}; 
		};

//action creators
export const actions = {
 moveTo: (playerId,x,y) => ({type:"MOVE_TO", playerId, x, y})

}