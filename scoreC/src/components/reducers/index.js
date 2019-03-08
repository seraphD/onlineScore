const initialState={
	number:'123',
	authenticated:false,
	group: [],
}

const appReducer = (state=initialState, action)=>{
	switch(action.type){
		case 'LOGIN_SUC': {
			let num = action.num;
			return {...state,authenticated:true,number:num};
		}
		case 'GET_GROUP': {
			return {...state, group: action.data}
		}
		default: {
			return {...state}
		}
	}
}

export default appReducer;