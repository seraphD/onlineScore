import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Motion, spring} from 'react-motion';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import config from '../../config';
import Typography from '@material-ui/core/Typography';

const styles = theme =>({
    group: {
        width: 200,
        height: 750,
        backgroundColor: '#fff',
        position: 'relative',
        right: 20,
        display: 'inline-block',
        verticalAlign: 'center',
    },
    item: {
        width: 175,
        margin: 0,
    },
    cur: {
        width: 175,
        backgroundColor: '#00c853',
        margin: 0,  
    },
    main: {
        width: 600,
        height: 700,
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '40px 0 0 0',
    },
    btn: {
        width: 100,
        height: 80,
        position: 'relative',
        verticalAlign: 'bottom',
    },
    audit: {
        display: 'inline-block',
        width: 385,
        height: 423,
        verticalAlign: 'top',
        margin: '150px 0 0 30px',
    }
})

const springConfig = {stiffness: 300, damping: 50};

class Load extends Component{
    constructor(props){
        super(props);
        this.state = {
            cur: -1,
            start: 0,
        }
    }

    start = () =>{
        let start = this.state.start;

        this.setState({
            start: !start,
            cur: 0,
        });
    }

    next = () =>{
        let cur = this.state.cur;

        this.setState({
            cur: cur+1
        })
    }

    renderGroup = () =>{
        let cur = this.state.cur;
        let group = {
            title: '',
        }
        if(cur >= 0){
            group = this.props.newGroup[cur];
        }

        return(
            <div>
                <Typography variant="h6" gutterBottom>
                   {group.title}
                </Typography>
            </div>
        )
    }

    componentWillMount(){
        let group = this.props.group;
        let numbers = [];

        for(let i=0;i<group.length;i++){
            numbers.push(group[i].number);
        }
        
        axios.post(config.URL_S+'audit/getAllName',{numbers})
        .then(res =>{
            // let {names} = res.data;
        })
    }

    render(){
        const {classes, dis, group} = this.props;
        let padding = (752 - group.length*21)/(2*group.length + 1);

        return(
            <div>
                <div className={classes.group}>
                    {group.map((o,i)=>{
                        const style = {
                            y: spring(this.state.start? dis[i]*46.8: 0, springConfig),
                        }

                        return(
                            <Motion style={style} key={i}>
                                {({y}) => 
                                    <div 
                                        className={i+dis[i] === this.state.cur? classes.cur: classes.item}
                                        style={{
                                            padding:`${padding}px`,
                                            transform: `translateY(${y}px)`
                                        }}
                                        key={i}
                                    >
                                    {o.title}
                                    </div>
                                }
                            </Motion>
                        )
                    })}
                </div>
                <Paper className={classes.main}>
                    <Button color="primary" className={classes.btn} onClick={this.start}>start</Button>
                    <Button color="primary" className={classes.btn} onClick={this.next}>next</Button>
                </Paper>
                <Paper className={classes.audit}>
                    {this.renderGroup()}
                </Paper>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
      group: state.group,
      newGroup: state.newGroup,
      dis: state.dis,
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