import React,{Component} from 'react';
import {API} from '../assets/api.js'

export default class Upload extends Component{


    componentDidMount(){
    }

    upload(file,fileName){
        let self=this;
        let onSuccess=self.props.onSuccess;
        let onError=self.props.onError;
        if(file){
            let formData=new FormData();
            if(fileName){
                formData.append(self.props.key||'file',file,fileName);                
            }else{
                formData.append(self.props.key||'file',file);
            }
            API.upload(formData)
                .then((res) => {
                    if(res.data.code == 0){
                        onSuccess(res.data)
                    }else{
                        onError(res.data)
                    }
                })
        }
    }

    onChange(e){
        if(this.props.onChange){
            this.props.onChange(e,this.upload.bind(this))
        }else{
            this.upload(e.target.files[0]);
        }
    }

    render(){
        return (
            <div onClick={(e)=>this.fileInput.click()}>
                <input type="file" ref={(dom)=>this.fileInput=dom} style={{display:"none"}} onChange={(e) => {this.onChange(e)}}/>
                {this.props.children}
            </div>
        )
    }

}
