import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import config from '../../config';

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
        margin: '100px 0 0 0',
        letterSpacing: 20,
    },
    appbar: {
        width: '100%',
        height: 100,
    },
    description: {
        width: '80%',
        margin: '50px auto 0 auto',
    },
    start: {
        width: 150,
    },
    btnContainer: {
        dispatch: 'inline-block',
        width: 150,
        textAlign: 'center',
        margin: '50px auto 0 auto',
    }
})

class Score extends Component{
    componentWillMount(){
        let group = this.props.group;

        if(group.length === 0){
            axios.post(config.URL_S+'main/getGroup')
            .then(res =>{
                let data = res.data;
                this.props.getGroup(data);
            })
        }
    }

    start = () =>{
        let group = this.props.group;

        axios.post(config.URL_S+'main/random',{group})
        .then(res =>{
            let newGroup = res.data.group;
            this.props.newGroup(newGroup);
        })
    }

    render(){
        const {classes} = this.props;

        return(
            <div className={classes.root}>
                <div className={classes.appbar}>

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
                <Button variant="outlined" color="primary" className={classes.start} onClick={this.start}>
                    开始
                </Button>
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
      newGroup(data){
        dispatch({type:'NEW_GROUP',data})
      }
    }
}

Score.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Score));