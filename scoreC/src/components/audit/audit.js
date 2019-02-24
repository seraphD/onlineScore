import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import $ from 'jquery';
import './audit.css';
import config from '../../config.js';
import io from 'socket.io-client';
import axios from 'axios';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class Audit extends Component{
    constructor(props){
        super(props);
        this.state = {
            id:-1,
            score:[0,0,0,0,0,0],
            name:'',
            info:{},
            confirm : true,
            time: 300,
            timeLeft: 0,
        }
    }

    static contextTypes ={
        router:PropTypes.object,
  	}

    componentWillMount(){
        this.socket = io(config.URL_S);
        let num = this.props.num;
        if(num !== '123'){
            axios.post(config.URL_S+'audit/getName',{num})
            .then(res => {
                this.setState({
                    name: res.data.name
                })
                this.socket.emit('loginOver', res.data.name);

                axios.post(config.URL_S+'curData')
                .then(res =>{
                    let {cur,curData} = res.data;

                    if(cur > -1){
                        this.setState({
                            info: curData
                        })

                        const name = this.state.name;
                        this.socket.emit('isContinue', {name});
                    }
                })
            })
        }
    }

    select = (id) => {
        let l = id.split('-')[0];
        let c = id.split('-')[1];
        // eslint-disable-next-line
        this.state.score[l] = parseInt(c);
        
        for(var i=60;i<=100;i+=10){
            var r = $('#'+l+'-'+i).hasClass('audit-score-selected');
            if( r === true && i !== parseInt(c) ){
                $('#'+l+'-'+i).removeClass('audit-score-selected');
            }
        }
    }

    componentDidMount(){
        $('.audit-score').click((e) => {
            var id = e.target.id;
            $(`#${id}`).addClass('audit-score-selected');
            this.select(id);
        })

        this.socket.on('startScore', (info)=>{
            let time = this.state.time;

            this.setState({
                info: info,
                confirm: false,
                timeLeft: time,
            })

            $('.audit-score').removeClass('audit-score-selected');
            
            this.timer = setInterval(() => {
                let tl = this.state.timeLeft;
                tl -= 1;

                if(tl >= 0){
                    this.setState({
                        timeLeft: tl
                    })
                }else{
                    this.confirm();
                }
            }, 1000);
        })

        this.socket.on('auditInit',()=>{
            this.setState({
                info: {},
            })
        })

        this.socket.on('stopScore',()=>{
            this.setState({
                confirm:true
            })
            clearInterval(this.timer);
        })

        this.socket.on('ansIsContinue', (o)=>{
            const {ans,name} = o;
            console.log(ans+" "+name);
            if(name === this.state.name && ans === 1){
                let time = 120;

                this.setState({
                    confirm: false,
                    timeLeft: time
                })

                this.timer = setInterval(() => {
                    let tl = this.state.timeLeft;
                    tl -= 1;
    
                    if(tl >= 0){
                        this.setState({
                            timeLeft: tl
                        })
                    }else{
                        this.confirm();
                    }
                }, 1000);
            }
        })
    }

    componentWillUnmount(){
        // let name = this.state.name;
        // console.log(this.state);
        // this.socket.emit('auditLogout',{name});
        this.socket.emit('disconnect',{name:this.state.name});
    }

    confirm = () =>{
        this.setState({
            confirm: true,
        });
        clearInterval(this.timer);

        const score = this.state.score;
        let result = {
            name: this.state.name,
            score: score,
        }
        this.socket.emit('auditScoreOver',result);
    }

    renderline = (line) =>{ 
        return(
            <div className='audit-line'>
                <span className='audit-score' id={`${line}-60`}>60</span>
                <span className='audit-score' id={`${line}-70`}>70</span>
                <span className='audit-score' id={`${line}-80`}>80</span>
                <span className='audit-score' id={`${line}-90`}>90</span>
                <span className='audit-score' id={`${line}-100`}>100</span>
            </div>
        )
    }

    showInfo = () =>{
        var info = this.state.info;
        if(JSON.stringify(info) === '{}'){
            return(
                <div className='audit-wait'>等待打分开始...</div>
            )
        }else{
            return(
                <div className='audit-mes'>
                    <h1 className='audit-h1'>小组产品名：{info.title}</h1>
                    <h2 className='audit-h1'>小组Github地址：<a href={info.github} target="blank">{info.github}</a></h2>
                </div>
            )
        }
    }

    render(){
        return(
            <div>
                <Paper elevation={1} className='audit-info'>
                    {this.showInfo()}
                </Paper>
                <Paper elevation={1} className='audit-sheet'>
                    <div className='audit-zone'>
                    <div className='audit-gpname'>
                        <h2>{this.state.name}</h2>
                        <div className='audit-countDown'>{this.state.timeLeft}</div>
                    </div>
                    <div className='audit-main'>
                        <div className='audit-label'>答辩</div>
                        {this.renderline(1)}
                        <div className='audit-label'>界面</div>
                        {this.renderline(2)}
                        <div className='audit-label'>功能</div>
                        {this.renderline(3)}
                        <div className='audit-label'>代码</div>
                        {this.renderline(4)}
                        <div className='audit-label'>团队</div>
                        {this.renderline(5)}
                        <Button variant="contained"  color="primary" className='audit-confirm' onClick={this.confirm} disabled={this.state.confirm}>
                            确定
                        </Button>
                    </div>
                    </div>
                </Paper>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
      num:state.number,
    }
}
  
function mapDispatchToProps(dispatch){
    return {
      login(num){
        dispatch({type:'LOGIN_SUC',num});
      },
    }
}  

export default connect(mapStateToProps,mapDispatchToProps)(Audit)

