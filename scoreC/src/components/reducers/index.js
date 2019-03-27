const initialState={
	number:'123',
	authenticated:false,
	group: [],
	audits: [],
	random: [],
}

const appReducer = (state=initialState, action)=>{
	switch(action.type){
		case 'LOGIN_SUC': {
			let num = action.num;
			return {...state,authenticated:true,number:num};
		}
		case 'GET_GROUP': {
			return {...state, group: action.data, length: action.data.length}
		}
		case 'SET_AUDITS': {
			return {...state, audits: action.data}
		}
		case 'SET_DATA': {
			return {...state, data: action.data};
		}
		case 'SET_RANDOM_GROUP': {
			return {...state, random: action.data};
		}
		default: {
			return {...state}
		}
	}
}

export default appReducer;