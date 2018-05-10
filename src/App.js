import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route,NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import SpiderEditor from './pages/SpiderEditor.js';
import TaskList from './pages/TaskList.js';
import TaskDetail from './pages/TaskDetail'

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ListItem from 'material-ui/List/ListItem';
import List from 'material-ui/List/List';

import {API,baseURL} from './assets/api.js'
import Avatar from 'material-ui/Avatar/Avatar';

function select(state){
  return {
    userData:state.userData
  }
}

class App extends Component {
  state={
    drawerOpen:false,
    pageData:''
  }

  handleToggle(){
    this.setState((preState,props) => {
      return {drawerOpen:!preState.drawerOpen}
    })
  }

  componentDidMount(){
  }

  render() {
    return (
        <div className="App">
          <AppBar title="欢迎" onLeftIconButtonClick={() => {this.handleToggle()}}/>
          <Drawer
           docked={false} 
           width={300} 
           open={this.state.drawerOpen}
           onRequestChange={(open) => this.handleToggle()}>

            <List>
              <ListItem
                leftAvatar={
                  <Avatar src={baseURL+this.props.userData.avatar} />
                }
              >
              {this.props.userData.username}
              </ListItem>
            </List>
            

            <Menu onItemClick={() => this.handleToggle()}>
              <MenuItem><NavLink to="/home/spiderEditor">新建爬虫任务</NavLink></MenuItem>
              <MenuItem><NavLink to="/home/taskList">任务列表</NavLink></MenuItem>
            </Menu>

          </Drawer>
          <div className="route-content">
          <Route path="/home/spiderEditor" component={SpiderEditor}></Route>
          <Route path="/home/taskList" component={TaskList}></Route>
          <Route path="/home/taskDetail" component={TaskDetail}></Route>
          </div>
          
        </div>
    );
  }
}

export default connect(select)(App);
