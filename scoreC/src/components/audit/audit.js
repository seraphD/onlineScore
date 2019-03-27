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
        margin: '0 0 0 850px',
    },
    github: {
        margin: '30px 0 0 0',
        color: 'white',
    },
    grade: {
        margin: '80px 0 0 50px',
        color: '#b71c1c',
    },
    notice: {
        margin: '50px 0 0 0',
    },
    mesNotice: {
        backgroundColor: '#880e4f',
        margin: '20px 0 0 0',
        padding: '10px',
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
                this.socket.emit('loginOver', res.data.name);

                // axios.post(config.URL_S+'curData')
                // .then(res =>{
                //     let {cur,curData} = res.data;

                //     if(cur > -1){
                //         this.setState({
                //             info: curData
                //         })

                //         const name = this.state.name;
                //         this.socket.emit('isContinue', {name});
                //     }
                // })

                axios.post(config.URL_S+'getRate')
                .then(res =>{
                    const {high, low, length} = res.data;

                    this.setState({high, low, length,
                        highLeft: high,
                        lowleft: low,
                    });
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

            if(this.props.num !== num){
                this.setState({
                    info: info,
                    confirm: false,
                    timeLeft: time,
                    cur: cur + 1,
                    score: [0,0,0,0,0,0],
                    start: true,
                    ave: 0,
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
                confirm:true
            })
            clearInterval(this.timer);
        })

        this.socket.on('ansIsContinue', (o)=>{
            const {ans,name} = o;
            console.log(name + " " + this.state.name);

            if(name === this.state.name && ans === true){
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

    ave = () =>{
        let {score} = this.state;

        let sum = 0;
        for(let i=0;i<score.length;i++){
            sum += score[i];
        }

        return sum/5;
    }

    isScoreOver = () =>{
        let over = true;
        let {score} = this.state;

        for(let i=1;i<score.lenght;i++){
            if(score[i] === 0){
                over = false;
                break;
            }
        }

        return over;
    }

    confirm = () =>{
        let ave = this.state.ave;
        if(ave >= 90){
            let {highLeft} = this.state;
            if(highLeft > 0){
                this.setState({
                    highLeft: highLeft-1,
                })
            }else{
                alert("你不能打这个分数!");
            }
        }

        if(ave >= 60 && ave < 70){
            let {lowleft} = this.state;
            if(lowleft > 0){
                this.setState({
                    lowleft: lowleft-1,
                })
            }else{
                alert("你不能打这个分数!");
            }
        }
        this.setState({
            confirm: true,
        })
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
                    <Typography variant="h4">{info.title}</Typography>
                </div>
            )
        }
    }

    render(){
        const {classes} = this.props

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
                        <Typography variant="h5" className={classes.notice}>
                            注意
                        </Typography>
                        <Paper elevation={5} className={classes.mesNotice}>
                            <Typography variant="h6" style={{color:'white'}}>
                                {this.state.highLeft > 0?
                                    `你还可以为${this.state.highLeft}个小组打90分及以上的成绩`:
                                    "你不能再打90分及以上的成绩了"}
                            </Typography>
                        </Paper>
                        <Paper elevation={5} className={classes.mesNotice}>
                            <Typography variant="h6" style={{color:'white'}}>
                                {this.state.lowleft > 0?
                                    `你还可以为${this.state.lowleft}个小组打70分以下的成绩`:
                                    "你不能再打70分以下的成绩了"}
                            </Typography>
                        </Paper>
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

