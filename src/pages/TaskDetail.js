import React from 'react';
import {API} from '../assets/api.js'
import {getQuery} from '../assets/util'

import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Badge from 'material-ui/Badge';

const style={
    inlineBlock:{display:"inline-block",width:"auto"}
}

export default class TaskDetail extends React.Component{
    state={
        resultList:{
            start:0,
            rows:10,
            total:0,
            list:[]
        }
    }

    componentDidMount(){
        let {id,name}= getQuery(this.props.location.search)
        if(id){
            API.getTaskResultList(id,name,this.state.resultList.start,this.state.resultList.rows)
                .then((res) => {
                    if(res.data.code == 0){
                        this.setState({
                            resultList:res.data.data
                        })
                    }
                })
        }
    }

    render(){
        return (
            <div className="task-detail">
                总数：{this.state.resultList.total}
                <List>
                    {this.state.resultList.list.map((item,index) => {
                        return (
                            <ListItem key={index}>
                                {
                                    JSON.stringify(item)
                                }
                            </ListItem>
                        ) 
                    })}
                </List>
            </div>
        )
    }

}