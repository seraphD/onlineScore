import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import $ from 'jquery';
import config from '../../config.js';
import io from 'socket.io-client';
import axios from 'axios';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import './audit.css';

const styles = theme =>({
    root: {
        
    },
    main: {
        width: 1216,
        height: 660,
        display: 'inline-block',
        margin: '60px 0 0 160px',
    },
    title: {
        width: '90%',
        height: 54,
        padding: 15,
        margin: '0 auto 0 auto',
        backgroundColor: '#c51162',
        position: 'relative',
        top: -30,
    },
    hint: {
        width: '80%',
        height: 154,
        padding: 15,
        margin: '0 auto 0 auto',
        backgroundColor: '#9c27b0',
        position: 'relative',
        top: -80,
    },
    mesT: {
        color: 'white',
        padding: '10px 0 0 0',
    },
    info: {
        display: 'inline-block',
        width: 400,
        height: 500,
        margin: '0 20px 0 0',
        verticalAlign: 'top',
        float: 'right',
        top: -485,
    },
    wait: {
        margin: '45px 0 0 0',
    },
    lines: {
        display: 'inline-block',
        width: 700,
        margin: '0 0 0 30px',
    },
    line: {
        margin: '15px 0 0 15px',
    },
    confirm: {
        width: '400px',
        margin: '25px 0 0 160px',
    },
    progress: {
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '0 0 0 800px',
    },
    github: {
        margin: '30px 0 0 0',
        color: 'white',
    },
    grade: {
        margin: '50px 0 0 50px',
        color: '#b71c1c',
    },
    notice: {
        margin: '50px 0 0 0',
    },
    mesNotice: {
        backgroundColor: '#880e4f',
        margin: '20px 0 0 0',
        padding: '10px',
    },
    left: {
        margin: '5px 0 5px 0',
    }
})

class Audit extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: -1,
            score: [0,0,0,0,0,0],
            name: '',
            info: {},
            confirm : true,
            time: 300,
            timeLeft: 0,
            cur: -1,
            start: false,
            ave: 0,
            vote: [],
        }
    }

    static contextTypes = {
        router: PropTypes.object,
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
                this.socket.emit('loginOver', {
                    name: res.data.name,
                    num
                });

                axios.post(config.URL_S+'getRate')
                .then(res =>{
                    let vote = res.data.vote;
                    let length = res.data.length;
                    this.setState({vote, length});
                })
            })
        }
    }

    select = (id) => {
        let l = id.split('-')[0];
        let c = id.split('-')[1];
        // eslint-disable-next-line
        this.state.score[l] = parseInt(c);
        let ave = this.ave();
        this.setState({ave});
        
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
            let {time, cur} = this.state;
            let num = info.number;
            let github = info.github;

            if(this.props.num !== num){
                this.setState({
                    info: info,
                    confirm: false,
                    timeLeft: time,
                    cur: info.cur,
                    score: [0,0,0,0,0,0],
                    start: true,
                    ave: 0,
                    github,
                })
            }else{
                this.setState({
                    info: info,
                    timeLeft: time,
                    cur: cur + 1,
                    score: [0,0,0,0,0,0],
                    start: true,
                    ave: 0,
                })

                this.socket.emit('auditScoreOver', {name: 'ignore', score: [0,0,0,0,0,0], ave: 0});
            }

            $('.audit-score').removeClass('audit-score-selected');
        })

        this.socket.on('auditInit',()=>{
            this.setState({
                info: {},
                score: [0,0,0,0,0,0]
            })
        })

        this.socket.on('stopScore',()=>{
            this.setState({
                confirm: true
            })
        })

        this.socket.on('alreadyScore', (object)=>{
            if(object.n.name === this.state.name){
                this.setState({
                    confirm: true,
                })
            }
        })

        this.socket.on('watchrank', ()=>{
            this.context.router.history.push('/audit/finish');
        })
    }

    ave = () =>{
        let {score} = this.state;

        let sum = 0;
        for(let i=0;i<score.length;i++){
            sum += score[i];
        }

        return sum/5;
    }

    confirm = () =>{
        let {ave, score, vote, name} = this.state;
        let temp = vote.slice();
        for(let i=0; i<score.length; i++){
            if(score[i] > 0){
                let index = 4 - (score[i] - 60)/10;
                
                if(temp[index]){
                    temp[index] -= 1;
                }else{
                    alert("请调整您的打分！！");
                    return;
                }
            }
        }
        
        this.setState({
            confirm: true,
            vote: temp,
        })

        let result = {name,score,ave}
        this.socket.emit('auditScoreOver', result);
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

    showInfo = (classes) =>{
        var info = this.state.info;
        if(JSON.stringify(info) === '{}'){
            return(
                <div className={classes.wait}>
                    <Typography variant="h4">
                        等待打分开始...
                    </Typography>
                </div>
            )
        }else{
            return(
                <div className={classes.wait}>
                   <Typography variant="h4"><a target="_blank" href={this.state.github} rel="noopener noreferrer">{info.title}</a></Typography>
                </div>
            )
        }
    }

    render(){
        const {classes} = this.props;
        let {vote} = this.state;

        return(
            <div className={classes.root}>
                <Paper className={classes.main} elevation={1}>
                    <Paper className={classes.title} elevation={1}>
                        <Typography variant="h5" className={classes.mesT}>
                            打分台
                            {this.state.cur > -1?
                                <div className={classes.progress}>
                                打分进度：{this.state.cur + 1}/{this.state.length}
                                </div>:
                                <div/>
                            }
                        </Typography>
                    </Paper>
                    <div className={classes.lines}>
                        <Typography variant="h5" className={classes.line}>答辩</Typography>
                            {this.renderline(1)}
                        <Typography variant="h5" className={classes.line}>界面</Typography>
                            {this.renderline(2)}
                        <Typography variant="h5" className={classes.line}>功能</Typography>
                            {this.renderline(3)}
                        <Typography variant="h5" className={classes.line}>代码</Typography>
                            {this.renderline(4)}
                        <Typography variant="h5" className={classes.line}>团队</Typography>
                            {this.renderline(5)}
                    </div>
                    <div className={classes.info}>
                        <Typography variant="h5">
                            当前打分
                        </Typography>
                        {this.showInfo(classes)}
                        <Typography variant="h1" className={classes.grade}>
                            {this.state.ave}
                        </Typography>
                        <Typography variant="h4" className={classes.notice}>
                            注意剩余评分次数
                        </Typography>
                        <div style={{margin:"20px 0 0 0"}}>
                        <Typography variant="h5" className={classes.left}>100: <span style={{margin:'0 0 0 20px'}}>{vote[0]}</span></Typography>
                        <Typography variant="h5" className={classes.left}>90: <span style={{margin:'0 0 0 30px'}}>{vote[1]}</span></Typography>
                        <Typography variant="h5" className={classes.left}>80: <span style={{margin:'0 0 0 30px'}}>{vote[2]}</span></Typography>
                        <Typography variant="h5" className={classes.left}>70: <span style={{margin:'0 0 0 30px'}}>{vote[3]}</span></Typography>
                        <Typography variant="h5" className={classes.left}>60: <span style={{margin:'0 0 0 30px'}}>{vote[4]}</span></Typography>
                        </div>
                    </div>
                    <Button className={classes.confirm} variant="contained" color="primary" disabled={this.state.confirm} onClick={this.confirm}>
                        确认
                    </Button>
                </Paper>
            </div>
        )
    }
}

Audit.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
    return{
      num: state.number,
      length: state.length,
      random: state.random,
    }
}
  
function mapDispatchToProps(dispatch){
    return {
      login(num){
        dispatch({type:'LOGIN_SUC',num});
      },
    }
}  

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Audit))

