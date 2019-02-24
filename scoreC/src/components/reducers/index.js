const initialState={
	number:'123',
	authenticated:false,
}

const appReducer = (state=initialState, action)=>{
	switch(action.type){
		case 'LOGIN_SUC': {
			let num = action.num;
			return {...state,authenticated:true,number:num};
		}
		default: {
			return {...state}
		}
	}
}

export default appReducer;