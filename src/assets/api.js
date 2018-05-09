import axios from 'axios';


const baseURL='http://localhost:3001/';

const api=axios.create({
    baseURL
})

class Api {
    static baseURL=baseURL;
    
    login(account,password){
        return api.post(`users/login`,{account,password});
    }

    signUp(data){
        return api.post(`users/signup`,data);
    }

    upload(data){
        return api.post(`users/upload`,data)
    }

    getPage(url){
        return api.get(`spider/getPage?url=${encodeURIComponent(url)}`);
    }

    getTaskList(){
        return api.get(`spider/taskList`);
    }

    createPageTask(name,task){
        return api.post(`spider/createPageTask`,{name,task});
    }

    getTaskResultList(id,name,start,rows){
        return api.get(`spider/result?id=${id}&name=${name}&start=${start}&rows=${rows}`)
    }

    runTask(id){
        return api.post(`spider/runTask`,{id});
    }

    stopTask(id){
        return api.post(`spider/stopTask`,{id});
    }

    deleteTask(id){
        return api.deleteTask(`spider/deleteTask`,{id});
    }
}

const API = new Api();


export {API,baseURL}