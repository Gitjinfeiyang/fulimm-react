import React from 'react';
import {API} from '../assets/api.js';
import {formatDate} from '../assets/util.js';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Route,NavLink} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton';
import Badge from 'material-ui/Badge';

const task_type={
    'page_task':"网页"
}

const cardStyle={
    display:"inline-block",

}

export default class TaskList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            taskList:[]
        }
        this.getTaskList()
    }

    getTaskList(start=0){
        API.getTaskList()
            .then((res) => {
                if(res.data.code == 0){
                    this.setState({
                        taskList:res.data.data
                    })
                }
            })
    }

    toggleRunTask(task){
        if(task.status == 0){
            API.runTask(task.id)
            .then((res) => {
                if(res.data.code == 0){
                    setTimeout(() => {
                        this.getTaskList(0)
                    },50)
                }
            })
        }else{
            API.stopTask(task.id)
                .then((res) => {
                    if(res.data.code == 0){
                        setTimeout(() => {
                            this.getTaskList(0)
                        },50)
                    }
                })
        }
        
    }



    render(){

        
        return (
            <div className="task-list">
                {this.state.taskList.map((item,index) => {
                    let json=JSON.parse(item.task_origin_arr);
                    let customDef={}
                    try{
                        customDef=JSON.parse(item.custom_def)
                    }catch(err){
                        customDef={}
                    }
                    return (
                        <NavLink className="task-item" to={`/home/taskDetail?id=${item.id}&name=${item.name}`} key={index}>
                            <Card  className="task-item" >
                                <CardHeader
                                title={item.name}
                                subtitle={task_type[item.type]+"       创建于"+formatDate(item.create_time)[0]}
                                avatar={customDef.favicon}
                                />
                                <CardActions className="task-status">
                                    <FlatButton onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        this.toggleRunTask(item)
                                        }}
                                        className="task-action-button" label={getLabel(item)} secondary={item.status == 1}
                                        disabled={item.status == 3}
                                        />
                                </CardActions>
                            </Card>
                        </NavLink>
                        
                    )
                    
                })}
            </div>
        )
    }

}

function getLabel({status,excutedTaskLength,taskQueLength}){
    switch (status){
        case 0:
            return "Start";
        case 1:
            return "Pause";
        case 2:
            return "Stop";
        case 3:
            return "closing "+parseInt((excutedTaskLength/taskQueLength)*100)+"%";
    }
}