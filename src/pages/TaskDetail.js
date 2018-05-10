import React from 'react';
import {API} from '../assets/api.js'
import {getQuery} from '../assets/util'

import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Badge from 'material-ui/Badge';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const style={
    inlineBlock:{display:"inline-block",width:"auto"}
}

export default class TaskDetail extends React.Component{
    state={
        resultList:{
            start:0,
            rows:50,
            total:0,
            list:[]
        },
        taskDetail:{},
        itemKey:{
            link:"",
            img:"",
            title:""
        }
    }
    task={
        id:0,name:""
    }

    componentDidMount(){
        let {id,name}= getQuery(this.props.location.search)
        if(id){
            this.task.id=id;
            this.task.name=name;
            this.getTaskResultList(0)
            this.getTaskDetail()
        }
    }

    getTaskResultList(start){
        API.getTaskResultList(this.task.id,this.task.name,this.state.resultList.start,this.state.resultList.rows)
        .then((res) => {
            if(res.data.code == 0){
                this.setState({
                    resultList:res.data.data
                })
            }
        })
    }

    getTaskDetail(){
        API.getTaskById(this.task.id)
            .then((res) => {
                res.data.data.taskOriginArr=JSON.parse(res.data.data.task_origin_arr)
                let target=res.data.data.taskOriginArr[res.data.data.taskOriginArr.length-1].target;
                for(let i=0; i<target.length; i++){
                    switch(target[i].value){
                        case 'text':
                            if(this.state.itemKey.title.length<=0){
                                this.setState(({itemKey}) => {
                                    itemKey.title=target[i].key
                                    return {itemKey}
                                })
                            }
                            break;
                        case 'src':
                            if(this.state.itemKey.img.length<=0){
                                this.setState(({itemKey}) => {
                                    itemKey.img=target[i].key;
                                    return {itemKey}
                                })
                            }
                            break;
                        case 'href':
                            if(this.state.itemKey.link.length<=0){
                                this.setState(({itemKey}) => {
                                    itemKey.link=target[i].key;
                                    return {itemKey}
                                })
                            }
                            break;
                    }
                }
                this.setState({
                    taskDetail:res.data.data
                })
            })
    }

    render(){
        return (
            <div className="task-detail">
                总数：{this.state.resultList.total}
                {this.state.itemKey.img.length>0?
                    this.state.resultList.list.map((item,index) => {
                        return (
                            <Card className="img-card" key={index}>
                                <CardMedia className="result-img-wrapper">
                                    <img src={item[this.state.itemKey.img]} alt="" />
                                </CardMedia>
                                <CardText>
                                    <a href={item[this.state.itemKey.link]} target="_blank">
                                        {item[this.state.itemKey.title]}
                                    </a>
                                </CardText>
                            </Card>
                        ) 
                     }):(
                    <List className="result-list">
                        {this.state.resultList.list.map((item,index) => {
                            return (
                                <ListItem key={index} primaryText={item[this.state.itemKey.title]} secondaryText={JSON.stringify(item)}>
                                </ListItem>
                            ) 
                        })}
                    </List>
                )}
                
            </div>
        )
    }

}