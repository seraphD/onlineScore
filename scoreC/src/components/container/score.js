import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import config from '../../config';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import io from 'socket.io-client';

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
    }
})

class Score extends Component{
    constructor(props){
        super(props);
        this.socket = io(config.URL_S);
        this.audits = [];
        this.state = {
            cur: -1, 
            dis: [],
            count: 0,
            start: false,
            login: false,
        }
    }

    componentWillMount(){
        // let group = this.props.group;

        // if(group.length === 0){
        //     axios.post(config.URL_S+'main/getGroup')
        //     .then(res =>{
        //         let data = res.data;
        //         this.props.getGroup(data);
        //     })
        // }
    }

    find = (name) =>{
        let audits = this.audits;
        for(let i=0;i<audits.length;i++){
            if(audits.name === name){
                return true
            }
        }
        return false;
    }

    componentDidMount(){
        this.socket.on('newAudit', (o)=>{
            const {gpname} = o;
            if(!this.find(gpname)){
                this.audits.push(o);

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
        let group = this.props.group;

        this.props.setAudits(audits);
        this.socket.emit('score',{title: group[0].title,github: group[0].github});
        his.push('/main/load');
    }

    startLogin = () =>{
        axios.post(config.URL_S+'init');
        let {start, login} = this.state;
        this.setState({
            start: !start,
            login: !login,
        })
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
                <Button variant="contained" color="primary" className={classes.start} onClick={this.startLogin} disabled={this.state.login}>
                    开启登录
                </Button>
                <Button variant="contained" color="secondary" className={classes.start} onClick={this.start} disabled={!this.state.start}>
                    开始
                </Button>
                </div>
                <div className={classes.loginProgress}>
                    <Typography variant="h4">
                        {this.state.count}/{this.props.group.length}名评委登录了系统
                    </Typography>
                </div>
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
      setData(data){
          dispatch({type:'SET_DATA',data});
      }
    }
}

Score.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Score));