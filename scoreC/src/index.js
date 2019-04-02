import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Audit from './components/audit/audit';
import Animate from './components/audit/animate/animate';
import require_auth from './components/require_auth/require_auth';
import {HashRouter as Router,Route,Switch,withRouter} from 'react-router-dom';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Provider} from 'react-redux';
import logger from 'redux-logger';
import appReducer from './reducers/index';
import rootSaga from './sagas/index';
import * as serviceWorker from './serviceWorker';
import MainLayout from './components/watch/main';

const sagaMiddleware=createSagaMiddleware();
const middlewares=[sagaMiddleware,logger];

const store=createStore(appReducer,applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);

const Page=withRouter((props)=>{
	return(
		<Switch>
			<Route path='/animate' component={Animate}/>
            <Route path='/audit' component={require_auth(Audit)}/>
			<Route path='/main' component={MainLayout}/>
			<Route path='/' component={App}/>
		</Switch>
		);
})

class Main extends React.Component{
	render(){
		return(
			<Router>
			<Page/>
			</Router>
		)
	}
}

ReactDOM.render(
	<Provider store={store}>
	<Main/>
	</Provider>, document.getElementById('root'));

serviceWorker.register();
