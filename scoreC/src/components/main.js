import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {HashRouter as Router,Route,Switch,withRouter} from 'react-router-dom';
import Group from './container/group';
import Score from './container/score';
import axios from 'axios';
import config from '../config';
import {connect} from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const styles = theme =>({
    root:{
        width: '100%',
        height: 'auto'
    },
    bar: {
        display: 'inline-block',
        backgroundColor: '#757575',
        width: 250,
        minHeight: 753,
        height: 'calc(100%)',
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
        "&$selected, &$selected:hover, &$selected:focus": {
            backgroundColor: "#1e88e5"
        },
    },
    selected: {},
    container: {
        display: 'inline-block',
        width: 1265,
        float: 'right',
    },
})

const Container=withRouter((props)=>{
	return(
		<Switch>
            <Route path='/main/group' component={Group}/>
            <Route path='/main' component={Score}/>
		</Switch>
		);
})

class MainLayout extends  Component{
    constructor(props){
        super(props);
        this.state = {
            selectedIndex: -1,
        }
    }

    static contextTypes ={
        router:PropTypes.object,
    }

    handleListItemClick = (event, index) => {
        this.setState({ selectedIndex: index });
        let his = this.context.router.history;

        axios.post(config.URL_S+'main/getGroup')
        .then(res =>{
            let data = res.data;
            this.props.getGroup(data);

            if(index === 1){
                his.push('/main/group');
            }else{
                his.push('/main/main');
            }
        })
    };

    render(){
        const {classes} = this.props;

        return(
            <div className={classes.root}>
            <div className={classes.bar}>
                <h1 className={classes.title}>Admin</h1>
                <hr className={classes.Divider}/>
                <List component="nav">
                    <ListItem
                        classes={{ root: classes.listItem, selected: classes.selected }}
                        button
                        selected={this.state.selectedIndex === 0}
                        onClick={event => this.handleListItemClick(event, 0)}
                    >
                    <ListItemIcon>
                    <InboxIcon />
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
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText 
                        classes={{ primary: classes.listItemText }}
                        primary="小组管理" />
                    </ListItem>
                </List>
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