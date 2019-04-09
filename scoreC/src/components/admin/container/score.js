import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import config from '../../../config';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import io from 'socket.io-client';
import $ from 'jquery';

const styles = theme =>({
    root: {
        margin: '0 0 0 0',
        overflow: 'auto',
        overflowX: 'hidden',
        overflowY: 'auto',
        height: 752,
        textAlign: 'top',
    },
    title: {
        textAlign: 'center',
        margin: '200px 0 0 0',
        letterSpacing: 20,
    },
    appbar: {
        width: 'calc(100% - 250px)',
        height: 100,
        position: 'absolute',
        left: '250px',
    },
    description: {
        width: '80%',
        margin: '50px auto 0 auto',
    },
    start: {
        width: 150,
        margin: '0 10px 0 10px',
    },
    btnContainer: {
        dispatch: 'inline-block',
        width: 340,
        margin: '50px auto 0 auto',
    },
    sectionDesktop: {
        width: 150,
        marginLeft: '87.5%',
    },
    loginProgress: {
        margin: '50px 0 0 0',
        textAlign: 'center',
        width: '360px',
    },
    rate: {
        margin: '30px 0 0 0',
    },
    input: {
        opacity: 0,
        width: 0,
    }
})

class Score extends Component{
    constructor(props){
        super(props);
        this.socket = io(config.URL_S);
        this.audits = [];
        this.numbers = [];
        this.state = {
            cur: -1, 
            dis: [],
            count: 0,
            start: false,
            login: false,
            open: false,
            imported: false,
            hightScoreRate: 0,
            lowScoreRate: 0,
            success: false,
            data: [],
        }
    }

    componentWillMount(){
        
    }

    find = (name) =>{
        let audits = this.audits;
        for(let i=0;i<audits.length;i++){
            if(audits[i] === name){
                return true
            }
        }
        return false;
    }

    componentDidMount(){
        this.socket.on('newAudit', (o)=>{
            const gpname = o.name;
            const num = o.num;
            if(!this.find(gpname)){
                this.audits.push(o.name);
                this.numbers.push(num);

                let c = this.state.count;
                this.setState({
                    count: c+1,
                })
            }
        })
    }

    static contextTypes ={
        router: PropTypes.object,
    }

    start = () =>{
        let his = this.context.router.history;
        let audits = this.audits;
        let numbers = this.numbers;
        let group = this.state.data;

        this.props.setAudits(audits);
        this.props.setNumber(numbers);
        this.socket.emit('score',{title: group[0].title, github: group[0].github, number: group[0].mobile, cur: 0});
        axios.post(config.URL_S+"start");
        his.push('/main/load');
    }

    startLogin = () =>{
        axios.post(config.URL_S+'init');
        let {start, login} = this.state;
        this.setState({
            start: !start,
            login: !login,
            open: true,
        })
    }

    handleOpen = () =>{
        this.setState({
            open: true,
        })
    }

    handleClose = () =>{
        this.setState({
            open: false,
            success: false,
        })
    }

    handleChange = prop => event =>{
        this.setState({ [prop]: event.target.value});
    }

    setRate = () =>{
        let {hightScoreRate, lowScoreRate} = this.state;

        axios.post(config.URL_S+'setRate', {hightScoreRate, lowScoreRate});
        this.setState({
            open: false,
        })
    }

    ImportFile = (classes) =>{
        let fileReader;

        const handleFileRead = (e) =>{
            const content = fileReader.result;
            const data = JSON.parse(content).data;
            axios.post(config.URL_S+"setData", {group: data});
            axios.post(config.URL_S+"main/random", {group: data})
            .then(res => {
                let group = res.data.group;
                this.props.getGroup(group);
                this.setState({
                    data: group,
                })
            });
            this.setState({imported: true, success: true, data});
        }

        const handleFileChosen = (file) =>{
            fileReader = new FileReader();
            fileReader.onloadend = handleFileRead;
            fileReader.readAsText(file);
        }

        const click = () =>{
            $('#input').click()
        }
    
        return(
            <Button variant="contained" color="primary" className={classes.button} onClick={click}>
                <input type='file' 
                    accept='.json' 
                    className={classes.input}
                    id='input' 
                    onChange={e => handleFileChosen(e.target.files[0])}
                />
                导入数据
            </Button>
        )
    }

    render(){
        const {classes} = this.props;

        return(
            <div className={classes.root}>
                <div className={classes.appbar}>
                    <div className={classes.sectionDesktop}>
                        <IconButton color="inherit">
                            <MailIcon />
                        </IconButton>
                        <IconButton color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton
                            aria-haspopup="true"
                            onClick={this.handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                </div>
                <Typography variant="h2" gutterBottom className={classes.title}>
                    开始打分
                </Typography>
                <Typography variant="subtitle1" gutterBottom className={classes.description}>
                    点击下方开始打分按钮后，需要进行打分的小组会自动随机排序，进入系统的评委会显示绿色，离线的显示灰色。
                    评委点击开始打分后打分者才可以进行评分，点击打分后结束当前组的评分，点击下一组进行下一组的打分。
                    评委可以随时结束本次评分，评分结束后会先显示图表，点击右上角图标可以下载xls数据表。
                </Typography>
                <div className={classes.btnContainer}>
                    {this.state.imported?
                    <div>
                    <Button variant="contained" color="primary" className={classes.start} onClick={this.startLogin} disabled={this.state.login}>
                        开启登录
                    </Button>
                    <Button variant="contained" color="secondary" className={classes.start} onClick={this.start} disabled={!this.state.start}>
                        开始
                    </Button>
                    <div className={classes.loginProgress}>
                        <Typography variant="h4">
                            {this.state.count}/{this.state.data.length}名评委登录了系统
                        </Typography>
                    </div>
                    </div>:this.ImportFile(classes)
                    }
                </div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"设置分数配比"}</DialogTitle>
                    <DialogContent>
                    <FormControl>
                        <Input
                            id="adornment-weight"
                            value={this.state.highRate}
                            onChange={this.handleChange('hightScoreRate')}
                            aria-describedby="weight-helper-text"
                            placeholder={"优秀率"}
                            endAdornment={<InputAdornment position="end">%</InputAdornment>}
                            inputProps={{
                                'aria-label': 'hight',
                            }}
                            className={classes.rate}
                        />
                        <Input
                            id="adornment-weight"
                            value={this.state.highRate}
                            onChange={this.handleChange('lowScoreRate')}
                            aria-describedby="weight-helper-text"
                            placeholder={"及格率"}
                            endAdornment={<InputAdornment position="end">%</InputAdornment>}
                            inputProps={{
                                'aria-label': 'low',
                            }}
                            className={classes.rate}
                        />
                    </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.setRate} color="primary">
                            确定
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            取消
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
      group: state.group,
    }
}
  
function mapDispatchToProps(dispatch){
    return {
      getGroup(data){
        dispatch({type:'GET_GROUP',data});
      },
      setAudits(data){
        dispatch({type:'SET_AUDITS',data})
      },
      setNumber(data){
        dispatch({type:'SET_NUMBER',data})
      },
      setData(data){
        dispatch({type:'SET_DATA',data});
      },
    }
}

Score.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Score));