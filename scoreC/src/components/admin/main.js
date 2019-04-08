import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {HashRouter as Router,Route,Switch,withRouter} from 'react-router-dom';
import Group from './container/group';
import Score from './container/score';
import Load from './load/load';
import {connect} from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import pic from '../../pic/backPic_2.jpg';
import Finish from './finish/finish';

const styles = theme =>({
    root:{
        width: '100%',
        height: 'auto',
    },
    icon: {
        color: 'white',
    },
    bar: {
        display: 'inline-block',
        backgroundColor: '#212121',
        width: 250,
        minHeight: 753,
        height: 'calc(100%)',
        opacity: 0.9,
    },
    title: {
        color: 'white',
        width: 100,
        marginTop: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    Divider: {
        color: 'white',
        width: '90%',
        margin: '0 auto 0 auto',
    },
    listItemText: {
        fontSize:'1em',
        color: 'white'
    },
    listItem: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        "&$selected, &$selected:hover, &$selected:focus": {
            backgroundColor: "#42a5f5",
            borderRadius: '5px',
        },
    },
    selected: {},
    container: {
        display: 'inline-block',
        width: 1265,
        float: 'right',
        overflowY: 'auto',
    },
    pic: {
        position: 'absolute',
        top: -0,
        left: -0,
        width: 250,
        height: '100%',
        zIndex: -1,
    },
})

const Container = withRouter((props)=>{
	return(
		<Switch>
            <Route path="/main/finish" component={Finish}/>
            <Route path='/main/load' component={Load}/>
            <Route path='/main/group' component={Group}/>
            <Route path='/main' component={Score}/>
		</Switch>
		);
})

class MainLayout extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedIndex: 0,
        }
    }

    static contextTypes ={
        router:PropTypes.object,
    }

    handleListItemClick = (event, index) => {
        this.setState({ selectedIndex: index });
        let his = this.context.router.history;

        if(index === 1){
            his.push('/main/group');
        }else his.push('/main');
    };

    componentWillMount(){
        // axios.post(config.URL_S+'main/getGroup')
        // .then(res =>{
        //     let data = res.data;

        //     axios.post(config.URL_S+'main/random', {group: data})
        //     .then(res => {
        //         let data = res.data.group;
        //         this.props.getGroup(data);
        //     })
        // })
    }

    render(){
        const {classes} = this.props;

        return(
            <div className={classes.root}>
            <div className={classes.pic}>
            <div className={classes.bar}>
                <h2 className={classes.title}>Admin</h2>
                <hr className={classes.Divider}/>
                <List component="nav">
                    <ListItem
                        classes={{ root: classes.listItem, selected: classes.selected }}
                        button
                        selected={this.state.selectedIndex === 0}
                        onClick={event => this.handleListItemClick(event, 0)}
                    >
                    <ListItemIcon>
                        <InboxIcon className={classes.icon}/>
                    </ListItemIcon>
                    <ListItemText 
                        classes={{primary:classes.listItemText}}
                        primary="打分" 
                    />  
                    </ListItem>
                    <ListItem
                        classes={{ root: classes.listItem, selected: classes.selected }}
                        button
                        selected={this.state.selectedIndex === 1}
                        onClick={event => this.handleListItemClick(event, 1)}
                    >
                    <ListItemIcon>
                        <DraftsIcon className={classes.icon}/>
                    </ListItemIcon>
                    <ListItemText 
                        classes={{ primary: classes.listItemText }}
                        primary="小组管理" />
                    </ListItem>
                </List>
            </div>
            <img src={pic} className={classes.pic} alt=''></img>
            </div>
            <div className={classes.container}>
                <Router>
                    <Container/>
                </Router>
            </div>
            </div>
        )
    }
}

MainLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
    return{
      num: state.number,
    }
}
  
function mapDispatchToProps(dispatch){
    return {
      getGroup(data){
        dispatch({type:'GET_GROUP',data});
      }
    }
}  

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(MainLayout))