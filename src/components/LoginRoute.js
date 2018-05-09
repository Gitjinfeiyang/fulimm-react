import {Route,Redirect} from 'react-router-dom';
import {withRouter} from 'react-router'
import React, { Component } from 'react';
import {connect} from 'react-redux';


function select(state){
	return {
		userData:state.userData
	}
}


class LoginRoute extends Component{
	render(){
		const { component: Component, ...rest }=this.props;

		return (
			<Route
				{...rest}
				render={props =>{
					return this.props.userData&&this.props.userData.token ? (
						<Component {...props} />
					) : (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: props.location }
							}}
						/>
					)
				}
					
				}
			/>
			)
		
	}
}


export default withRouter(connect(select)(LoginRoute))