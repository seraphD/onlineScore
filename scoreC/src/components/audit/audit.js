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
    main: {
        width: 800,
        height: 660,
        display: 'inline-block',
        margin: '60px 0 0 150px',
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
    mesT: {
        color: 'white',
        padding: '10px 0 0 0',
    },
    info: {
        display: 'inline-block',
        width: 385,
        height: 423,
        verticalAlign: 'top',
        margin: '130px 0 0 100px',
        textAlign: 'center'
    },
    wait: {
        margin: '180px 0 0 0',
    },
    lines: {
        margin: '80px 0 0 0',
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
        margin: '0 0 0 530px',
    },
    github: {
        margin: '50px 0 0 0',
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

                axios.post(config.URL_S+'getLen')
                .then(res => {
                    this.setState({
                        length: res.data.length,
                    })
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
            let cur = this.state.cur;

            this.setState({
                info: info,
                confirm: false,
                timeLeft: time,
                cur: cur + 1,
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

    showInfo = (classes) =>{
        var info = this.state.info;
        if(JSON.stringify(info) === '{}'){
            return(
                <div className={classes.wait}>等待打分开始...</div>
            )
        }else{
            return(
                <div className={classes.wait}>
                    <Typography variant="h4">{info.title}</Typography>
                    <Typography variant="subtitle1" className={classes.github}><a href={info.github} target="blank">项目地址</a></Typography>
                </div>
            )
        }
    }

    render(){
        const {classes} = this.props

        return(
            <div>
                <Paper className={classes.main} elevation={1}>
                    <Paper className={classes.title} elevation={5}>
                        <Typography variant="h5" className={classes.mesT}>
                            打分台
                            {this.state.cur > -1?
                                <div className={classes.progress}>
                                {this.state.cur + 1}/{this.state.length}
                                </div>:
                                <div/>
                            }
                        </Typography>
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
                        <Button className={classes.confirm} variant="contained" color="primary" disabled={this.state.confirm} onClick={this.confirm}>
                            确认
                        </Button>
                    </Paper>
                </Paper>
                <Paper className={classes.info} elevation={1}>
                    <Typography variant="h5">
                        {this.showInfo(classes)}
                    </Typography>
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

