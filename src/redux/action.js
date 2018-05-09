const ACTION_TYPE={
	UPDATE_USER:'UPDATE_USER',
}


const ACTIONS={
	updateUser(userData){
		return {
			type:ACTION_TYPE.UPDATE_USER,
			data:userData
		}
	}
}

export {ACTION_TYPE}
export default ACTIONS;