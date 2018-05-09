import React from 'react'
import {API} from '../assets/api'

import Popover from 'material-ui/Popover';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import {
    Step,
    Stepper,
    StepButton,
    StepContent,
  } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';

const entry_param_type={
    array:0,
    object:1
}

//至少取5层选择器
function getAbsoluteSelector(dom,start=0){
    let mStart=start+1;
    let selector=dom.tagName;
    if(dom.className&&dom.className.length>0){
        let classNames=dom.className.split(" ");
        selector=dom.tagName;
        for(let i=0; i<classNames.length;i++){
            if(classNames[i].length>0){
                selector+='.'+classNames[i];
            }
        }
        if(mStart<5){
            selector=getAbsoluteSelector(dom.parentElement,mStart)+">"+selector            
        }
    }else{
        selector=getAbsoluteSelector(dom.parentElement,mStart)+">"+selector
    }

    return selector;
}



export default class SpiderEditor extends React.Component{
    pageContainer;
    currentHighlightDomList=[];

    constructor(props){
        super(props);
        this.state={
            taskName:"",
            taskEntry:{
                entry:"",params:[
                    {name:"",value:[]}
                ]
            },
            taskTarget:[
                    // {selector:"",key:"",value:""}
            ],
            taskEntrySelector:[
                // {entrySelector:""}
            ],
            entryParamType:entry_param_type.array,
            editor:{
                selector:"",
                values:[],
                saveType:"1",
                paramType:"text",
                keyName:""
            },
            openEditorDialog:false,
            editorDialogForm:{
                value:""
            },
            stepIndex:0,
            paramInput:"",
            noticebar:{
                open:false,
                message:""
            }
        }

        this.handleNoticeBarClose=this.handleNoticeBarClose.bind(this)
    }

    handleEntryChange(event,newValue){
        this.setState(({taskEntry},props) => {
            taskEntry.entry=newValue;
            return {taskEntry};
        })
    }

    getEntryPage(){
        if(this.state.taskEntry.entry.length>0){
            this.getPage(this.state.taskEntry.entry)
        }
        
    }

    getPage(url){
        if(url.length<=0) return;
        let href=url;
        if(/\^http/.test(href)){

        }else if(new RegExp('^/').test(href)){
            let host=this.state.taskEntry.entry;
            if(new RegExp('^http.*/').test(host)){
                let temp1=new RegExp('^http.*/').exec(host);
                if(temp1){
                    let temp=new RegExp('.*(?=/$)').exec(temp1[0])
                    if(temp){
                        href=temp[0]+href;
                    }
                }
            }else{
                href=host+href;
            }
        }
        API.getPage(href)
            .then((res) => {
                this.pageContainer.innerHTML=res.data.data;
            })
    }

    handleContainerClick(e){
        let selector,values=[];
        e.preventDefault();
        e.stopPropagation();
        if(this.currentHighlightDomlist&&this.currentHighlightDomlist[0]&&this.currentHighlightDomlist[0].className){
            for(let i=0; i<this.currentHighlightDomlist.length; i++){
                this.currentHighlightDomlist[i].className=this.currentHighlightDomlist[i].className.replace(" highlight","")
            }
        }

        selector=getAbsoluteSelector(e.target);
        this.currentHighlightDomlist=this.pageContainer.querySelectorAll(selector);            
        for(let i=0; i<this.currentHighlightDomlist.length; i++){
            if(i == 0){
                if(this.currentHighlightDomlist[i].href){
                    values.push({
                        type:"超链接",
                        value:"href",
                        example:this.currentHighlightDomlist[i].pathname
                    })
                }

                if(this.currentHighlightDomlist[i].src){
                    values.push({
                        type:"图片",
                        value:"src",
                        example:this.currentHighlightDomlist[i].src
                    }) 
                }else{
                    values.push({
                        type:"文字",
                        value:"text",
                        example:this.currentHighlightDomlist[i].innerText
                    })
                }
                
                values.push({
                    type:"内容",
                    value:"html",
                    example:this.currentHighlightDomlist[i].innerHTML                   
                })

                let dataset=this.currentHighlightDomlist[i].dataset;
                Object.keys(dataset).forEach((key) => {
                    values.push({
                        type:key,
                        value:"dataset",
                        example:dataset[key]                  
                    })
                })
                
            }
            if(this.currentHighlightDomlist[i].className){
                this.currentHighlightDomlist[i].className+=" highlight";
            }else{
                this.currentHighlightDomlist[i].className=" highlight";
            }
        }

        this.setState(({editor}) => {
            editor={selector,values}
            return {editor,openEditorDialog:true};
        })

    }

    handleParamTypeChange(event,index,newValue){
        switch(newValue){
            case entry_param_type.array:
                this.setState(({taskEntry},props) => {
                    taskEntry.params[0]= {name:"",value:[]}
                })
                break;
            case entry_param_type.object:
                this.setState(({taskEntry},props) => {
                    taskEntry.params[0] = {name:"",value:{start:1,end:999,step:1}}
                })
                break;
        }
        this.setState({
            entryParamType:newValue
        })
    }

    handleRequestParamsDelete(index){
        this.setState(({taskEntry}) => {
            taskEntry.params[0].value.splice(index,1);
            return {taskEntry}
        })
    }

    renderStepActions(step) {
        return (
          <div style={{margin: '12px 0'}}>
            {step == 2?<RaisedButton
                label="保存"
                disableTouchRipple={true}
                disableFocusRipple={true}
                primary={true}
                onClick={this.handleSaveTask.bind(this)}
                style={{marginRight: 12}}
                />:<RaisedButton
                label="下一步"
                disableTouchRipple={true}
                disableFocusRipple={true}
                primary={true}
                onClick={this.handleNext}
                style={{marginRight: 12}}
            />}
            
            {step > 0 && (
              <FlatButton
                label="返回"
                disableTouchRipple={true}
                disableFocusRipple={true}
                onClick={this.handlePrev}
              />
            )}
          </div>
        );
      }

    handleNext = () => {
        const {stepIndex} = this.state;
        if (stepIndex < 2) {
            this.setState({stepIndex: stepIndex + 1});
        }
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    handleSaveTask(){
        let arr=[];
        arr.push(this.state.taskEntry)
        for(let i=0; i<this.state.taskEntrySelector.length; i++){
            arr.push(this.state.taskEntrySelector[i])
        }
        arr.push({target:this.state.taskTarget})
        API.createPageTask(this.state.taskName,arr)
            .then((res) => {
                if(res.data.code == 0){
                    this.props.history.push("/home/taskList")
                }else{
                    this.showNotice(res.data.msg||"创建失败")
                }
            })

    }

    handleAddSelector(){
        switch(this.state.editor.saveType){
            case "1":
                this.setState(({taskEntrySelector,editor}) => {
                    taskEntrySelector.push({entrySelector:editor.selector})
                    this.getPage(editor.values[0].example)                    
                    return {taskEntrySelector}
                })
                break;
            case "2":
                this.setState((state) => {
                    let {editor,taskTarget}=state;
                    let {selector,paramType:value,keyName:key}=editor;
                    taskTarget.push({
                        selector,value,key
                    })
                    return {taskTarget}
                })

        }
        this.setState({stepIndex:parseInt(this.state.editor.saveType)})
    }

    handleEditorParamTypeChange(e,index,value){
        this.setState(({editor},props) => {
            editor.paramType=value;
            return {editor}
        })
    }

    handleParamInputChange(e,newValue){
        this.setState({paramInput:newValue})        
    }

    handleNoticeBarClose(){
        this.setState(({noticebar}) => {
            noticebar.open=false;
            return {noticebar}
        });
    }

    showNotice(message){
        this.setState(({noticebar}) => {
            noticebar.open=true;
            noticebar.message=message;
            return {noticebar}
        })
    }


    
      render(){
        const {stepIndex} = this.state;

        return (
            <div className="spider-editor">
                <div className="toolbar fl">               
                <Stepper
                    activeStep={stepIndex}
                    linear={false}
                    orientation="vertical"
                    >
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 0})}>
                            创建入口
                        </StepButton>
                        <StepContent>
                            <TextField
                                style={{width:'230px'}}
                                hintText="请输入任务名"
                                floatingLabelText="名称"
                                value={this.state.taskName}
                                onChange={(e,newValue) => {
                                    this.setState({taskName:newValue})
                                }}
                                />
                                <br/>
                            <TextField
                                style={{width:'230px'}}
                                hintText="请输入入口URL"
                                floatingLabelText="URL"
                                value={this.state.taskEntry.entry}
                                onChange={this.handleEntryChange.bind(this)}
                                onBlur={this.getEntryPage.bind(this)}
                                />
                                <br/>
                            <SelectField
                                floatingLabelText="参数类型"
                                value={this.state.entryParamType}
                                onChange={this.handleParamTypeChange.bind(this)}
                                >
                                <MenuItem value={entry_param_type.array} primaryText="多选" />
                                <MenuItem value={entry_param_type.object} primaryText="自增" />
                            </SelectField><br/>
                            <TextField
                                    hintText="项"
                                    floatingLabelText="项"
                                    value={this.state.taskEntry.params[0].name}
                                    onChange={(e,newValue) => {
                                        this.setState(({taskEntry}) => {
                                            taskEntry.params[0].name=newValue;
                                            return {taskEntry}
                                        })
                                    }}
                                    />
                            {
                                this.state.entryParamType == entry_param_type.array?
                                (<div>
                                    {this.state.taskEntry.params[0].value.map((item,index) => {
                                        return(
                                            <Chip
                                                key={index}
                                                onRequestDelete={this.handleRequestParamsDelete.bind(this,index)}
                                                >
                                                {item}
                                            </Chip>
                                        )
                                    })}
                                    <TextField
                                    hintText="项"
                                    floatingLabelText="项"
                                    style={{width:"200px"}}
                                    value={this.state.paramInput}
                                    onChange={this.handleParamInputChange.bind(this)}
                                    />
                                    <FlatButton onClick={() => {
                                        this.setState(({taskEntry}) => {
                                            taskEntry.params[0].value.push(this.state.paramInput)
                                            return {taskEntry,paramInput:""}
                                        })
                                    }}>
                                        添加
                                    </FlatButton>
                                </div>):(
                                    <div>
                                        <TextField
                                        hintText="Start"
                                        floatingLabelText="Start"
                                        value={this.state.taskEntry.params[0].value.start}
                                        onChange={(e,newValue) => {
                                            this.setState(({taskEntry}) => {
                                                taskEntry.params[0].value.start=newValue;
                                                return {taskEntry}
                                            })
                                        }}
                                        />
                                        <br/>
                                        <TextField
                                        hintText="End"
                                        floatingLabelText="End"
                                        value={this.state.taskEntry.params[0].value.end}
                                        onChange={(e,newValue) => {
                                            this.setState(({taskEntry}) => {
                                                taskEntry.params[0].value.end=newValue;
                                                return {taskEntry}
                                            })
                                        }}
                                        />
                                        <br/>
                                        <TextField
                                        hintText="Step"
                                        floatingLabelText="Step"
                                        value={this.state.taskEntry.params[0].value.step}
                                        onChange={(e,newValue) => {
                                            this.setState(({taskEntry}) => {
                                                taskEntry.params[0].value.step=newValue;
                                                return {taskEntry}
                                            })
                                        }}
                                        />
                                        <br/>
                                    </div>
                                )
                            }
                            {this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 1})}>
                            创建抓取流程
                        </StepButton>
                        <StepContent>
                            <div>
                                {this.state.taskEntrySelector.map((item,index) => {
                                    return <ListItem
                                        key={index}
                                        rightIcon={<span onClick={() => {
                                            this.setState(({taskEntrySelector}) => {
                                                taskEntrySelector.splice(index,1)
                                                return {taskEntrySelector}
                                            })
                                        }}>x</span>}
                                        primaryText={item.entrySelector}
                                    />
                                })}
                            </div>
                            {this.renderStepActions(1)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 2})}>
                            创建抓取目标
                        </StepButton>
                        <StepContent>
                            <div>
                                {
                                    this.state.taskTarget.map((item,index) => {
                                        return <ListItem
                                        key={index}
                                        rightIcon={<span onClick={() => {
                                            this.setState(({taskTarget}) => {
                                                taskTarget.splice(index,1)
                                                return {taskTarget}
                                            })
                                        }}>x</span>}
                                        primaryText={item.key+" : "+item.selector+" ("+item.value+")" }
                                    />
                                    })
                                }
                            </div>
                        {this.renderStepActions(2)}
                        </StepContent>
                    </Step>
                    </Stepper>
                </div>
                <div className="page-container fr">
                    <div ref={(dom) => {this.pageContainer=dom;}} onClick={this.handleContainerClick.bind(this)}></div>
                </div>
                <Dialog
                    title="编辑"
                    modal={false}
                    open={this.state.openEditorDialog}
                    onRequestClose={() => {this.setState({openEditorDialog:false})}}
                    actions={<FlatButton onClick={() => {
                        this.handleAddSelector()
                        this.setState({openEditorDialog:false})
                    }}>保存</FlatButton>}
                    >
                    <TextField
                        floatingLabelText="Selector"
                        value={this.state.editor.selector}
                        onChange={(e,newValue) => this.setState(({editor}) => {
                            editor.selector=newValue;
                            return {editor}
                        })}
                        />
                        <br/>
                    <SelectField
                        floatingLabelText="节点类型"
                        hintText="节点类型"
                        value={this.state.editor.saveType}
                        onChange={(e,index,newValue) => {
                            this.setState(({editor}) => {
                                editor.saveType=newValue;
                                return {editor}
                            })
                        }}
                        >
                        <MenuItem value="1" primaryText="抓取流程" />
                        <MenuItem value="2" primaryText="抓取目标" />
                    </SelectField><br/>
                    <div style={{display:this.state.editor.saveType == "2"?"block":"none"}}>
                        <SelectField
                            floatingLabelText="参数类型"
                            hintText="参数类型"
                            value={this.state.editor.paramType}
                            onChange={this.handleEditorParamTypeChange.bind(this)}
                            >
                            {this.state.editor.values.map((item,index) => {
                                return(
                                    <MenuItem style={{width:"250px",overflow:"hidden"}} key={index} value={item.value} primaryText={item.type}>
                                        <span className="example-text">{item.example}</span>
                                    </MenuItem>                                    
                                )
                            })}
                        </SelectField><br/>
                        <TextField
                            floatingLabelText="Key"
                            hintText="Key"                           
                            onChange={(e,newValue) => this.setState(({editor}) => {
                                editor.keyName=newValue;
                                return {editor}
                            })}
                        />
                    </div>
                    
                </Dialog>
                <Snackbar
                    open={this.state.noticebar.open}
                    message={this.state.noticebar.message}
                    autoHideDuration={4000}
                    onRequestClose={this.handleNoticeBarClose}
                    />
            </div>
        )
    }

}