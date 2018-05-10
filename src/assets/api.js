import axios from 'axios';
import {store} from '../index.js'

const baseURL='http://localhost:3001/';

const api=axios.create({
    baseURL
})

// Add a request interceptor
api.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.token=store.getState().userData.token;
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  api.interceptors.response.use(function (response) {
    if(response.status == 203){
        window.location.pathname="/login"
    }
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

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

    getTaskById(id){
        return api.get(`spider/getTaskById?id=${id}`)
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