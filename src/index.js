import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import {createStore,applyMiddleware,compose} from 'redux';
import {Provider} from 'react-redux';
import reducers from './redux/reducer';
import actions from './redux/action';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {getUserData} from './assets/cache.js'

import LoginRoute from './components/LoginRoute';
import Login from './pages/Login'

const store=createStore(reducers);

const userData=getUserData();
store.dispatch(actions.updateUser(userData))

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider>
			<BrowserRouter>
				<div>
					<LoginRoute path="/home" component={App}></LoginRoute>
					<Route path="/login" component={Login}></Route>
					<Route path="/signup" component={Login}></Route>
				</div>
			</BrowserRouter>
		</MuiThemeProvider>
	</Provider>
    
    , document.getElementById('root'));
registerServiceWorker();


export {store}
