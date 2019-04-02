import { takeLatest } from 'redux-saga/effects';

function* LOGIN_SUC(action){
	
}

function* watcher(){
	yield takeLatest('LOGIN_SUC',LOGIN_SUC)
}

export default function* rootsaga(){
	yield watcher();
}