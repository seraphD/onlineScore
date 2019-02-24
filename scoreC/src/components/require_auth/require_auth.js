import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

export default function (ComposedComponent){
	class Authentication extends React.Component{
		static contextTypes={
			router:PropTypes.object,
			store:PropTypes.object
		}

		componentWillMount(){
			if(!this.props.authenticated){
				this.context.router.history.push('/');
			}
		}

		render(){
			return <ComposedComponent {...this.props}/>
		}
	}

	function mapStateToProps(state){
		return {authenticated:state.authenticated}
	}

	function mapDispatchToProps(dispatch){
		return {
			login(num){
				dispatch({type:'LOGIN_SUC',num});
			}
		}
	}

	return connect(mapStateToProps,mapDispatchToProps)(Authentication);
}