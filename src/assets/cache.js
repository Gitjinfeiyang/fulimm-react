export const setUserData=function(userData){
    sessionStorage.setItem("fuli_userdata",JSON.stringify(userData))
}

export const getUserData=function(){
    return JSON.parse(sessionStorage.getItem("fuli_userdata")||"{}")
}