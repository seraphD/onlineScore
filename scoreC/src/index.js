import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Audit from './components/audit/audit';
import Watch from './components/watch/watch';
import require_auth from './components/require_auth/require_auth';
import {HashRouter as Router,Route,Switch,withRouter} from 'react-router-dom';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Provider} from 'react-redux';
import logger from 'redux-logger';
import appReducer from './components/reducers/index';
import rootSaga from './components/sagas/index';
import * as serviceWorker from './serviceWorker';

const sagaMiddleware=createSagaMiddleware();
const middlewares=[sagaMiddleware,logger];

const store=createStore(appReducer,applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);

const Page=withRouter((props)=>{
	return(
		<Switch>
            <Route path='/watch' component={require_auth(Watch)}/>
            <Route path='/audit' component={require_auth(Audit)}/>
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
