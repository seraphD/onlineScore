import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import config from '../../../config';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '../table/table';
import io from 'socket.io-client';
import queue from '../queue/queue.js';

const styles = theme =>({
    main: {
        width: 1216,
        height: 'auto',
        minHeight: '650px',
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '80px auto 0 15px',
        textAlign: 'left',
    },
    root: {
        height: 750,
        overflowY: 'auto',
    },
    mesTitle: {
        fontSize: '1.5em',
        margin: '15px 0 0 40px',
    },
    reserve: {
        width: '100%',
        height: 100,
    },
    audits: {
        color: 'white',
        fontSize: '1.3em',
        padding: '20px 0 0 20px',
    },
    head: {
        width: 1186,
        height: 84,
        backgroundColor: '#aa00ff',
        position: 'relative',
        left: '15px',
        top: '-30px',
    },
    message: {
        width: '50%',
        height: 490,
        textAlign: 'left',
        display: 'inline-block',
        verticalAlign: 'top',
    },
    notice: {
        width: 543,
        height: 20,
        padding: '20px 15px 20px 15px',
        margin: ' 0 0 20px 0',
        backgroundColor: '#2196f3',
        color: 'white',
    },
    warn: {
        width: 543,
        height: 20,
        padding: '20px 15px 20px 15px',
        margin: ' 0 0 20px 0',
        backgroundColor: '#ff9800',
        color: 'white',
    },
    reconnect: {
        width: 543,
        height: 20,
        padding: '20px 15px 20px 15px',
        margin: ' 0 0 20px 0',
        backgroundColor: '#43a047',
        color: 'white',
    },
    finish: {
        width: 543,
        height: 20,
        padding: '20px 15px 20px 15px',
        margin: ' 0 0 20px 0',
        backgroundColor: '#d81b60',
        color: 'white',
    },
    over: {
        width: 543,
        height: 20,
        padding: '20px 15px 20px 15px',
        margin: ' 0 0 20px 0',
        backgroundColor: '#e53935',
        color: 'white',
    },
    Snackbars: {
        margin: '40px 0 40px 20px',
    },
    subtitle: {
        color: 'white',
        marginLeft: '10px',
    },
    plainText: {
        width: 543,
        height: 31,
        padding: '20px 15px 20px 15px',
        margin: ' 0 0 20px 0',
        color: 'black',
        verticalAlign: 'center',
    },
    progress: {
        margin: '0 0 0 20px',
    },
    stopBtn: {
        width: 100,
        height: 40,
        display: 'inline-block',
        margin: '0 0 0 300px',
    },
    progressTitle: {
        fontSize: '1.5em',
        margin: '115px 0 0 40px',
    },
    grade: {
        margin: '0 15px 0 250px',
    }
})

class Load extends Component{
    constructor(props){
        super(props);
        this.socket = io(config.URL_S);
        this.queue = queue;
        this.record = [];
        this.state = {
            cur: 0,
            start: 0,
            names: [],
            open: true,
            pause: false,
            count: 0,
            finalScore: 0,
        }
    }

    static contextTypes ={
        router:PropTypes.object,
    }

    componentWillMount(){
        
    }

    enqueue = (message) => {
        if(!this.queue.full()){
            this.queue.enqueue(message);
        }else{
            this.queue.dequeue();
            this.queue.enqueue(message);
        }
    }

    componentDidMount(){
        let socket = this.socket;

        socket.on('showScore', (result)=>{
            if(result.name !== ''){
                let message = {
                    type: 1,
                    name: result.name,
                    score: result.ave,
                }
                let c = this.state.count + 1;
                let cur = this.state.cur;

                this.record.push(result);
                this.enqueue(message);

                this.setState({count: c});
                if(c === this.props.audits.length){
                    axios.post(config.URL_S+'score', {
                        score: this.record,
                        cur: this.state.cur,
                    }).then(res => {
                        let finalScore = res.data.result.result;
                        let mes = {
                            type: 2,
                            group: this.state.cur,
                        }

                        this.enqueue(mes);
                        this.record = [];
                        this.setState({
                            finalScore: parseInt(finalScore)
                        });

                        let group = this.props.group[cur+1];

                        if(cur+1 !== this.props.group.length){
                            this.timer = setTimeout(() => {
                                this.setState({
                                    count: 0,
                                    cur: cur + 1,
                                    finalScore: 0,
                                })
                                this.socket.emit('score',{title: group.title, github: group.github, number: group.number});
                            }, 5000);
                        }else{
                            let mes = {
                                type: 3,
                            }
                            this.enqueue(mes);
                            this.setState({});
                        }
                    })
                }
            }
        })

        this.socket.on('auditDis', (o)=>{
            const {index} = o;
            let name = this.props.audits[index-1];

            let message = {
                type: 4,
                name
            }

            this.enqueue(message);
            this.setState({});
        })

        this.socket.on('newAudit', (o)=>{
            const gpname = o;

            let index = -1;
            for(let i=0;i<this.props.audits.length;i++){
                let temp = this.props.audits[i].name;

                if(gpname === temp){
                    index = i;
                    break;
                }
            }

            if(index !== 1){
                let mes = {
                    type: 5,
                    name: gpname
                }

                this.enqueue(mes);
                this.setState({});
            }
        })
    }
    
    handleClose = () =>{
        this.setState({
            open: false,
        })
    }

    pause = () =>{
        let p = this.state.pause;
        this.setState({
            pause: !p
        })

        let his = this.context.router.history;
        his.push("/main/finish");
        this.socket.emit('stopScore');
    }

    render(){
        const {classes} = this.props;
        let cur = this.state.cur;
        let queue = this.queue.dataStore.slice();

        return(
            <div className={classes.root}>
                <Paper className={classes.main}>
                    <Paper className={classes.head}>
                        <Typography className={classes.audits}>
                            评委席
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom className={classes.subtitle}>
                            当前有{this.props.audits.length}名裁判在进行打分
                        </Typography>
                    </Paper>
                    <div className={classes.message}>
                        <Typography className={classes.mesTitle}>当前打分</Typography>
                        <div className={classes.Snackbars}>
                            <Paper elevation={5} className={classes.plainText}>
                                <Typography variant="h5">
                                    {this.props.group.length === 0? '':this.props.group[cur].title}
                                </Typography>
                            </Paper>
                        </div>
                        <Typography className={classes.mesTitle}>打分进度</Typography>
                        <div className={classes.Snackbars}>
                            <Typography className={classes.progress} variant="h4">
                                {this.state.count}/{this.props.audits.length}&nbsp;名评委完成了打分  
                            </Typography>
                        </div>
                        <Typography className={classes.mesTitle}>最终成绩</Typography>
                        <div className={classes.grade}>
                            <Typography variant="h1" style={{color: '#dd2c00'}}>
                                {this.state.finalScore}
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.message}>
                        <Typography className={classes.mesTitle}>打分动态
                        {this.state.pause?<Button variant="contained" color="primary" className={classes.stopBtn} onClick={this.pause}>恢复打分</Button>:
                        <Button variant="contained" color="secondary" className={classes.stopBtn} onClick={this.pause}>停止打分</Button>}
                        </Typography>
                        <div className={classes.Snackbars}>
                            {queue.reverse().map((o,i) => {
                                switch(o.type){
                                    case 1: return(
                                        <Paper elevation={5} className={classes.notice} key={i}>
                                            评委&nbsp;{o.name}&nbsp;为该组的打分为{o.score}。
                                        </Paper>
                                    )
                                    case 2: return(
                                        <Paper elevation={5} className={classes.finish} key={i}>
                                            小组&nbsp;{o.group+1}&nbsp;打分已经结束。5秒后进入下一组打分。
                                        </Paper>
                                    )
                                    case 3: return(
                                        <Paper elevation={5} className={classes.over} key={i}>
                                            本次打分已经结束
                                        </Paper>
                                    )
                                    case 4: return(
                                        <Paper elevation={5} className={classes.warn} key={i}>
                                            评委&nbsp;{o.name}&nbsp;离开了系统。
                                        </Paper>
                                    )
                                    case 5: return(
                                        <Paper elevation={5} className={classes.reconnect} key={i}>
                                            评委&nbsp;{o.name}&nbsp;重新进入了系统。
                                        </Paper>
                                    )
                                    default: return(
                                        <Paper elevation={5} className={classes.notice} key={i}>
                                            未知异常信息
                                        </Paper>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    <Table socket={this.socket}></Table>
                </Paper>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
      group: state.group,
      audits: state.audits,
    }
}
  
function mapDispatchToProps(dispatch){
    return {
      
    }
}

Load.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Load));