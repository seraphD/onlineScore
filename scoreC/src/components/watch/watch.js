import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import io from 'socket.io-client';
import config from '../../config';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ReactHighcharts from 'react-highcharts';
import $ from 'jquery';
import './watch.css';

const HighchartsExporting = require('highcharts-exporting')
HighchartsExporting(ReactHighcharts.Highcharts)

require('highcharts-export-csv')(ReactHighcharts.Highcharts)

var config_line={
	chart: {
        type: 'bar'
    },
    title: {
        text: '成绩排名'
    },
    xAxis: {
        categories: [],
        title:{
        	text:'组别'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '总分'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
            }
        }
    },
    legend: {
        reversed: true
    },
    sum:[],
    plotOptions: {
        series: {
            stacking: 'normal',
            dataLabels: {
                style: {
                    textOutline: 'none'
                }
            }
        }
    },
    tooltip: {
        pointFormat: '{series.name}: {point.y}'
    },
    series: [{
        name: '得分',
        data: []
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }
}

const styles = theme => ({
    paper: {
      position: 'absolute',
      width: theme.spacing.unit * 50,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing.unit * 4,
      outline: 'none',
    },
    buttonInModal: {
        position: 'absolute',
        top: 160,
        marginLeft:50,
    },
    button: {
        width: 100,
        marginLeft: 20,
    }
  });

class Watch extends Component{
    constructor(props,context){
        super(props);
        this.socket = io(config.URL_S);
        this.state = {
            wait: false,
            start: false,
            cur: 0,
            log: [],
            data: [],
            offLine: [],
            finalScore: 0,
            chartsData: config_line,
            initialBtn: false,
            startBtn: true,
            scoreBtn: true,
            nextBtn: true,
            finishBtn: true,
            visible: false,
            open: false,
            scContinue: false,
        }
    }

    componentWillMount(){
        axios.post(config.URL_S+'getData')
        .then(res => {
            const {data,finish} = res.data;

            this.setState({
                data: data
            })

            if(finish === 0){
                this.setState({
                    scContinue: true
                })
            }
        })
    }

    findAudit = (name) =>{
        let audits = this.state.log;
        for(let i=0;i<audits.length;i++){
            if(name === audits[i].name){
                return i;
            }
        }
        return -1;
    }

    isInOffLine = (name) =>{
        let index = -1;
        let offLine = this.state.offLine;

        for(let i=0;i<offLine.length;i++){
            if(name === offLine[i].name){
                index = i;
                break;
            }
        }
        return index;
    }

    componentDidMount(){
        this.socket.on('newAudit', (audit)=>{
            if(audit !== 'no'){
                let index = this.findAudit(audit);
                if(index === -1){
                    let offA = this.isInOffLine(audit);
                    let temp = this.state.log;
                    if(offA === -1){
                        let newAudit = {
                            name: audit,
                            score: [0,0,0,0,0,0],
                            confirm: 0,
                        }
                        
                        temp.push(newAudit);
                        this.setState({
                            log: temp,
                        })
                    }else{
                        let newAudit = this.state.offLine[offA];
                        
                        temp.push(newAudit);
                        this.setState({
                            log: temp,
                        })
                        alert('一位打分者重新进入了系统');
                    }
                }
            }
        })

        this.socket.on('showScore', (result)=>{
            if(result !== null){
                let name = result.name;
                let score = result.score;
                let id = this.findAudit(name);

                let temp = this.state.log;
                if(id !== -1){
                    temp[id].score = score;
                    temp[id].confirm = 1;

                    this.setState({
                        log: temp
                    })
                }
            }
        })

        this.socket.on('askContinue', (o)=>{
            const {name} = o;
            let id = this.findAudit(name);

            if(id !== -1){
                let c = this.state.log[id].confirm;

                let ans = 0;
                if(c === 0){
                    ans = 1;
                }
                this.socket.emit('ansContinue',{ans,name});
            }
        })

        this.socket.on('auditDis',(o)=>{
            const {index} = o;
            let temp = this.state.log;
            let offLine = this.state.offLine;
            let offAudit = temp[index-1];
            alert('一位打分者离开了系统');

            offLine.push(offAudit);

            temp.splice(index-1, 1);
            this.setState({
                log: temp,
                offLine: offLine
            })
        })
    }

    componentWillUnmount(){
        axios.post(config.URL_S+'adminLogout');
    }

    initial = () =>{
        this.setState({
            wait:true,
            start:false,
            initialBtn: true,
            startBtn: false,
            finalScore:0,
        });

        let temp = this.state.log;
        for(let i=0;i<temp.length;i++){
            temp[i].score = [0,0,0,0,0,0];
            temp[i].confirm = 0;
        }

        this.setState({
            log: temp
        })

        axios.post(config.URL_S+'init');
        axios.post(config.URL_S+'audit/init');
        this.socket.emit('init');

        $('.watch-info').show();
        $('.watch-audits').show();
        $('#container').hide();
    }

    start = () =>{
        this.setState({
            wait: false,
            start: true,
            cur: 0,
            startBtn: true,
            scoreBtn: false,
            finishBtn: false,
        })
        this.socket.emit('score',this.state.data[0]);
        axios.post(config.URL_S+'start', {log:this.state.log});
    }

    isScoreOver = () =>{
        let audits = this.state.log;
        for(let i=0;i<audits.length;i++){
            let c = audits[i].confirm;
            
            if(c === 0){
                return -1;
            }
        }
        return 1;
    }

    isScore = () =>{
        let over = this.isScoreOver();

        if(over === 1){
            this.score();
        }else{
            this.setState({
                open:true
            })
        }
    }

    score = () =>{
        axios.post(config.URL_S+'score', {score:this.state.log, cur:this.state.cur, log:this.state.log})
        .then(res =>{
            let data = res.data.result;

            this.setState({
                finalScore: data.result,
                scoreBtn: true,
                nextBtn: false,
                open: false,
            })
        })

        this.socket.emit('scoreOver');
    }

    scoreInit = () =>{
        var temp = this.state.log;
        for(let audit of temp){
            audit.score = [0,0,0,0,0,0];
            audit.confirm = 0;
        }
        this.setState({
            log: temp,
        })
    }

    next = () =>{
        var now = this.state.cur;
        if(now < this.state.data.length-1){
            this.setState({
                cur: now+1,
                finalScore: 0,
                scoreBtn: false,
                nextBtn: true,
            })
            let info = this.state.data[now+1];
            this.socket.emit('score',info);
            axios.post(config.URL_S+'next', {log: this.state.log});
        }else{
            alert('评分完毕');
            this.setState({
                scoreBtn: true,
                nextBtn: true,
                finishBtn: false,
            })
        }
        this.scoreInit();
    }

    confirmFinish = () =>{
        if(this.state.cur < this.state.data.length-1){
            this.setState({
                visible: true
            })
        }else{
            this.finish();
        }
    }

    handleClose = () =>{
        this.setState({
            visible: false,
            open: false,
            scContinue: false
        })
    }

    finish = () =>{
        axios.post(config.URL_S+'finish')
        .then(res =>{
                var temp = this.state.chartsData;
                var data = res.data;

                temp.xAxis.categories = data.catagory;
                temp.series[0].data = data.grade;
                this.setState({
                    chartsData: temp,
                    initialBtn: false,
                    finishBtn: true,
                    scoreBtn: true,
                    nextBtn: true,
                    visible: false,
                })

                $('.watch-info').hide();
                $('.watch-audits').hide();
                $('#container').show();
        })

        this.socket.emit('scoreOver');
    }

    showGroup = (cur) =>{
        var info = this.state.data[parseInt(cur)];
        return(
            <div>
            <div className="watch-basic-info">
                <h1 className='watch-h1'>正在给第{cur+1}个小组打分</h1>
                <h1 className='watch-h1'>小组产品名：{info.title}</h1>
                <h2 className='watch-h1'>小组Github地址：<a href={info.github} target="blank">{info.github}</a></h2>
                {/* <div className='watch-final-score'>最终得分:{this.state.finalScore}</div> */}
            </div>
            <div className="watch-final-score">
                {this.state.finalScore}
            </div>
            </div>
        )
    }

    ModalStyle = () =>{
        const top = 50;
        const left = 50;

        return {
            top: `${top}%`,
            left: `${left}%`,
            width: 300,
            height: 150,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }

    reStart = () =>{
        axios.post(config.URL_S+'reStart')
        .then(res =>{
            let {cur, confirm, tempLog, tempScore} = res.data;
            
            if(cur !== -1){
                this.setState({
                    cur: cur,
                    initialBtn: true,
                    startBtn: true,
                    start: true,
                    finishBtn: false,
                })
            }

            if(confirm === 1){
                this.setState({
                    scoreBtn: true,
                    nextBtn: false,
                    scContinue: false,
                    log: tempLog,
                    finalScore: tempScore,
                })
            }else{
                this.setState({
                    scoreBtn: false,
                    nextBtn: true,
                    scContinue: false,
                    log: tempLog,
                })
            }

            $('.watch-info').show();
            $('.watch-audits').show();
            $('#container').hide();
        })
    }
 
    render(){
        const { classes } = this.props;

        return(
            <div>
                <div>
                    <AppBar position="static" color="default">
                        <Toolbar>
                        <Typography variant="h6" color="inherit">
                        <div className='watch-funbtn'>
                            <Button variant="contained" color="default" onClick={this.initial} id="init" disabled={this.state.initialBtn}>
                                初始化
                            </Button>
                        </div>
                        <div className='watch-funbtn'>
                            <Button variant="contained" color="primary" onClick={this.start}  id="start" disabled={this.state.startBtn}>
                                开始
                            </Button>
                        </div>
                        <div className='watch-funbtn'>
                            <Button variant="contained" color="primary" onClick={this.isScore}  id="score" disabled={this.state.scoreBtn}>
                                打分
                            </Button>
                        </div>
                        <div className='watch-funbtn'>
                            <Button variant="contained" color="primary" onClick={this.next}  id="next" disabled={this.state.nextBtn}>
                                下一个
                            </Button>
                        </div>
                        <div className='watch-funbtn'>
                            <Button variant="contained" color="secondary" onClick={this.confirmFinish}  id="finish" disabled={this.state.finishBtn}>
                                结束
                            </Button>
                        </div>
                        </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className='watch-info'>
                        {this.state.wait?<h1 className='watch-wait'>正在等待评委登录...</h1>:<div/>}
                        {this.state.start?<div>{this.showGroup(this.state.cur)}</div>:<div/>}
                    </div>
                    <div className='watch-audits'>
                        {this.state.log.map( (audit, id) => {
                            return(
                                <div className='watch-audit' key={id}>
                                    <Card>
                                        <h2 className='watch-gpname'>
                                            {audit.name}
                                        </h2> 
                                        <Divider />
                                        <List component="nav">
                                            <ListItem divider>
                                                <ListItemText primary="答辩" />
                                                <ListItemText primary={audit.score[1]} />
                                            </ListItem>
                                            <ListItem divider>
                                                <ListItemText primary="界面" />
                                                <ListItemText primary={audit.score[2]} />
                                            </ListItem>
                                            <ListItem divider>
                                                <ListItemText primary="功能" />
                                                <ListItemText primary={audit.score[3]} />
                                            </ListItem>
                                            <ListItem divider>
                                                <ListItemText primary="团队" />
                                                <ListItemText primary={audit.score[4]} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="代码" />
                                                <ListItemText primary={audit.score[5]} />
                                            </ListItem>
                                        </List>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                    <div id="container" style={{width:1000,height:200}}>
                        <ReactHighcharts config={this.state.chartsData} className='charts'></ReactHighcharts>
                    </div>
                </div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.visible} 
                    onClose={this.handleClose}
                >
                    <div className={classes.paper} style={this.ModalStyle()}>
                        <Typography variant="h6" id="modal-title">
                        是否确认提前结束打分?
                        </Typography>
                        <Typography variant="h6" id="modal-title" className={classes.buttonInModal}>
                        <Button variant="contained" color="default" className={classes.button} onClick={this.handleClose}>取消</Button>
                        <Button variant="contained" color="primary" className={classes.button} onClick={this.finish}>确认</Button>
                        </Typography>
                    </div>
                </Modal>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open} 
                    onClose={this.handleClose}
                >
                    <div className={classes.paper} style={this.ModalStyle()}>
                        <Typography variant="h6" id="modal-title">
                        还有评委没有完成打分，确定进行评分吗?
                        </Typography>
                        <Typography variant="h6" id="modal-title" className={classes.buttonInModal}>
                        <Button variant="contained" color="default" className={classes.button} onClick={this.handleClose}>取消</Button>
                        <Button variant="contained" color="primary" className={classes.button} onClick={this.score}>确认</Button>
                        </Typography>
                    </div>
                </Modal>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.scContinue} 
                    onClose={this.handleClose}
                >
                    <div className={classes.paper} style={this.ModalStyle()}>
                        <Typography variant="h6" id="modal-title">
                        上一次打分还没有结束，是否继续?
                        </Typography>
                        <Typography variant="h6" id="modal-title" className={classes.buttonInModal}>
                        <Button variant="contained" color="default" className={classes.button} onClick={this.handleClose}>取消</Button>
                        <Button variant="contained" color="primary" className={classes.button}  onClick={this.reStart}>确认</Button>
                        </Typography>
                    </div>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
      
    }
  }
  
function mapDispatchToProps(dispatch){
    return {
      login(num){
        dispatch({type:'LOGIN_SUC',num});
      }
    }
} 

Watch.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(Watch))