import React,{Component} from 'react';
import Editor from '../assets/JImageEditor.min.js';

import RaisedButton from 'material-ui/RaisedButton';
import '../App.css'

export default class ImageEditor extends Component{
    state={
        imageEditor:{},
        show:false,
        file:{}
    }

    options={
        container:'.image-editor-wrapper',   //必填 挂载容器
        limit:{
          minWidth:100,//宽度限制
          maxWidth:400,
          minHeight:100,//高度限制
          maxHeight:400,
          maxSize:50,//图片大小限制 kb
          proportion:1/1,//宽高比
        },
        beforeReadFile:(image) => {
          this.setState({
              show:true,
              file:image
          })
        },
        afterRender:() => {
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.file && nextProps.file.name&& nextProps.file != prevState.file){
            prevState.imageEditor.readFile&&prevState.imageEditor.readFile(nextProps.file);
        }
        return prevState;
    }

    componentDidMount(){
        this.setState({
            imageEditor:new Editor(this.options)
        })
        if(this.props.file){
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.show != this.state.show){
            return true;
        }
        return false;
      }

    render(){
        return (
            <div className="image-editor-wrapper" style={{display:this.state.show?"block":"none"}}>
                <div className="button-group">
                    <RaisedButton onClick={() => this.state.imageEditor.rotateZ(90)}>旋转</RaisedButton>
                    <RaisedButton onClick={() => {
                        this.setState({
                            show:false
                        })
                        this.state.imageEditor.save((blob,dataUrl) => this.props.onSave(blob,dataUrl))
                        }}>确认</RaisedButton>
                </div>
            </div>
        )
    }

}