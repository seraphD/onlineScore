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

const styles = theme =>({
    root:{
        width: '100%',
    },
    bar: {
        display: 'inline-block',
        backgroundColor: '#424242',
        width: 250,
        height: 'auto',
        minHeight: 752,
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
        width: '80%',
        margin: '0 auto 0 auto',
    },
    listItemText: {
        fontSize:'1em',//Insert your required size
        color: 'white'
    },
    listItem: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        "&$selected, &$selected:hover, &$selected:focus": {
            backgroundColor: "#2962ff"
        },
    },
    selected: {},
    container: {
        display: 'inline-block',
        width: 1265,
        minHeight:700,
        margin: '50px 0 0 20px',
        float: 'right',
    }
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

        if(index === 1){
            axios.post(config.URL_S+'main/getGroup')
            .then(res =>{
                let data = res.data;
                this.props.getGroup(data);
                his.push('/main/group');
            })
        }

        if(index === 0){
            his.push('/main');
        }
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