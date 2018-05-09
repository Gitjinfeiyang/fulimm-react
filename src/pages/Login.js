import React, { Component } from 'react';

import {Tabs, Tab} from 'material-ui/Tabs';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import Snackbar from 'material-ui/Snackbar';

import Upload from '../components/Upload.js';
import {connect} from 'react-redux';
import {API,baseURL} from '../assets/api.js';
import actions from '../redux/action.js';
import {Redirect,withRouter} from 'react-router-dom'
import {setUserData} from "../assets/cache.js"
import ImageEditor from '../components/ImageEditor.js';

function select(state){
    return {userData:state.userData}
}

const radioStyle={
    display:"inline-block",
    width:"100px",
    marginTop:"20px"
}

const MyAvatar=(props) => {
    if(props.url&&props.url.length>0){
        return (
            <div style={{width:"80px", height:"80px",overflow:"hidden",borderRadius:"50%",display:"inline-block"}}>
                <img src={baseURL+props.url} alt="" style={{width:"100%"}}/>
            </div>
        )
    }else{
        return <Avatar icon={<FileFolder />} />
    }
}

class Login extends Component {

    onTabChange=(path) => {
        this.props.history.push(path)
    }

    constructor(props){
        super(props);
        this.state={
            loginForm:{
                account:"",
                password:""
            },
            signupForm:{
                username:"",
                account:"",
                password:"",
                sex:"",
                confirmPassword:"",
                avatar:"",
                phone:"",
                email:""
            },
            redirect:false,
            imageSelected:{},
            notice:{
                open:false,
                msg:"",
            }
        }
    }

    handleLoginFormChange(value,name){
        this.setState(({loginForm},props) => {
            loginForm[name]=value;
            return {loginForm}
        })
    }

    handleSignFormChange(value,name){
        this.setState(({signupForm},props) => {
            signupForm[name]=value;
            return {signupForm}
        })
    }

    login(){
        const loginForm=this.state.loginForm;
        API.login(loginForm.account,loginForm.password)
            .then((res) => {
                if(res.data.code >=0){
                    setUserData({token:res.data.token,...res.data.data})
                    this.props.dispatch(actions.updateUser({token:res.data.token,...res.data.data}))
                    this.setState({redirect:true})
                }
            })
    }

    setAvatar(url){
        this.setState(({signupForm},props) => {
            signupForm.avatar=url;
            return {
                signupForm
            }
        })
    }

    editPic(e,next){
        this.setState({
            imageSelected:e.target.files[0],
        })
        this.imageEditorNext=next;
    }

    handleNoticeClose(){
        this.setState(({notice},props) => {
            notice.open=false;
            return notice;
        })
    }

    handleNoticeOpen(msg){
        this.setState(({notice}) => {
            notice.open=true;
            notice.msg=msg;
            return notice;
        })
    }

    signup=()=>{
        let {username,account,password,sex,phone,email,avatar}=this.state.signupForm;

        API.signUp({username,account,password,sex,phone,email,avatar})
            .then((res) => {
                if(res.data.code == 0){
                    this.switchToLogin()
                }
            })
    }

    switchToLogin(){
        this.props.history.push("/login");
    }

    render(){

        if(this.state.redirect){
            return (<Redirect to={{pathname:"/home"}}></Redirect>)
        }else{
            return (
                <div className="login-wrapper" style={{textAlign:"center",background:"#f1f1f1",height:"100vh"}}>
                    <Card style={{display:"inline-block",width:"500px",marginTop:"200px",background:"#fff"}}>
                            <Tabs value={this.props.location.pathname} onChange={this.onTabChange}>
                                <Tab label="登录" value="/login">
                                    <div  style={{padding:"20px",textAlign:"center"}}>
                                        <TextField
                                            hintText="请输入帐户名"
                                            floatingLabelText="账户"
                                            onChange={(event,newValue) => {
                                                this.handleLoginFormChange(newValue,"account")
                                            }}
                                            /><br/>
                                        <TextField
                                            hintText="请输入密码"
                                            floatingLabelText="密码"
                                            type="password"
                                            onChange={(event,newValue) => {
                                                this.handleLoginFormChange(newValue,"password")
                                            }}
                                            /><br/>
                                            <div style={{textAlign:"right",padding:"20px"}}>
                                                <FlatButton label="登录" primary={true} onClick={() => {this.login()}}/>
                                            </div>
                                    </div>
                                </Tab>
                                <Tab label="注册" value="/signup">
                                    <div style={{padding:"20px"}}>
                                        <CardMedia style={{textAlign:"center"}}>
                                            <Upload
                                                key="file"
                                                onChange={(e,next) => {this.editPic(e,next)}}
                                                onSuccess={(data) => {
                                                    this.setAvatar(data.data[0].url)                                                        
                                                }}
                                                >
                                                <MyAvatar url={this.state.signupForm.avatar}></MyAvatar>
                                            </Upload>
                                            <ImageEditor file={this.state.imageSelected} onSave={(dataUrl,blob) => {
                                                    this.imageEditorNext(blob,"avatar.jpg")
                                                }}></ImageEditor>
                                        </CardMedia>
                                        <TextField
                                            hintText="请输入用户名"
                                            floatingLabelText="用户名"
                                            onChange={(event,newValue) => {
                                                this.handleSignFormChange(newValue,"username")
                                            }}
                                            /><br/>
                                        <TextField
                                            hintText="请输入帐户名"
                                            floatingLabelText="账户"
                                            onChange={(event,newValue) => {
                                                this.handleSignFormChange(newValue,"account")
                                            }}
                                            /><br/>
                                        <TextField
                                            hintText="请输入密码"
                                            floatingLabelText="密码"
                                            type="password"
                                            onChange={(event,newValue) => {
                                                this.handleSignFormChange(newValue,"password")
                                            }}
                                            /><br/>
                                        <RadioButtonGroup name="sex" defaultSelected="1"
                                            onChange={(event,newValue) => {
                                                this.handleSignFormChange(newValue,"sex")
                                            }}
                                            >
                                            <RadioButton
                                                value="1"
                                                label="男"
                                                style={radioStyle}
                                                inputStyle={radioStyle}
                                            />
                                            <RadioButton
                                                value="2"
                                                label="女"
                                                style={radioStyle}  
                                                inputStyle={radioStyle}                                                                                              
                                            />
                                        </RadioButtonGroup>                                            
                                            <TextField
                                            hintText="请输入电话号码"
                                            floatingLabelText="电话号码"
                                            onChange={(event,newValue) => {
                                                this.handleSignFormChange(newValue,"phone")
                                            }}
                                            /><br/>
                                            <TextField
                                            hintText="请输入邮箱"
                                            floatingLabelText="邮箱"
                                            onChange={(event,newValue) => {
                                                this.handleSignFormChange(newValue,"email")
                                            }}
                                            /><br/>
                                        <div style={{textAlign:"right",padding:"20px"}}>
                                            <FlatButton label="注册" primary={true} onClick={this.signup}/>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                    </Card>
                    <Snackbar
                        open={this.state.notice.open}
                        message={this.state.notice.msg}
                        autoHideDuration={4000}
                        onRequestClose={this.handleNoticeClose}
                        />
                </div>
            )
        }
        
    }

}

export default connect(select)(Login)