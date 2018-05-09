import {ACTION_TYPE} from './action.js';
import {combineReducers} from 'redux'

const REDUCERS_OBJ={
	userData:function(state={},action){
		switch(action.type){
			case ACTION_TYPE.UPDATE_USER:
				return action.data;
				break;
			default:
				return state;
		}
	}
}

const REDUCERS=combineReducers(REDUCERS_OBJ);

export default REDUCERS;