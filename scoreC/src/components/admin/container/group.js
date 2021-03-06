import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import $ from 'jquery';
import axios from 'axios';
import config from '../../../config';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';

const styles = theme =>({
    root:{
        margin: '0 0 0 0',
        overflow: 'auto',
        overflowX: 'hidden',
        overflowY: 'auto',
        height: 752,
        textAlign: 'top',
    },
    group: {
        width: 270,
        height: 120,
        display: 'inline-block',
        margin: '0 0 0 20px',
    },
    groups:{
        
    },
    container: {
        display: 'inline-block',
        margin: '30px 20px 0 0',
    },
    extra: {
        width: '30%',
        height: 80,
        position: 'relative',
        display: 'inline-block',
        left: '10%',
        top: -20,
        backgroundColor: '#66bb6a'
    },
    title: {
        width: '40px',
        fontSize: '0.9em',
        display: 'inline-block',
        margin: '0 0 0 200px',
        position: 'relative',
        top: '-80px',
    },
    grade: {
        fontSize: '1.2em',
        width: '20px',
        margin: '25px auto 0 auto',
        textAlign: 'center',
    },
    number: {
        width: '60%',
        margin: 'auto',
        fontSize: '0.8em',
    },
    button: {
        position: 'relative',
        left: '130px',
        top: '-10px',
    },
    divider: {
        width: '50%',
        position: 'relative',
        left: '120px',
        top: '-80px',
    },
    groupName: {
        width: '150px',
        position: 'relative',
        left: '100px',
        top: '-70px',
        textAlign: 'right',
        margin: '0',
    },
    input: {
        width: 0,
    },
    inputButton: {
        width: 270,
        height: 120,
    },
    appbar: {
        width: 'calc(100% - 250px)',
        height: 80,
        position: 'relative',
        left: '250px',
    },
    add: {
        width: 260,
        height: 110,
        display: 'inline-block',
        margin: '30px 0 0 20px',
        border: '5px',
        borderRadius: 15,
        borderStyle: 'dashed',
        borderColor: '#2196f3',
        verticalAlign: 'top',
        textAlign: 'center',
    },
    fab: {
        margin: '25px 0 0 0',
    },
    sectionDesktop: {
        width: 150,
        marginLeft: '85%',
    },
})

class Group extends Component{
    constructor(props){
        super(props);
        this.state = {
            group: [],
        }
    }

    componentDidMount(){
        
    }

    ImportFile = (classes) =>{
        let fileReader;

        const handleFileRead = (e) =>{
            const content = fileReader.result;
            let data = JSON.parse(content).groups;
            axios.post(config.URL_S+'main/addGroup', {data})
            .then(res => {
                let temp = this.props.group;

                for(let i=0;i<data.lenght;i++){
                    let d = {
                        title: data[i].title,
                        number: data[i].number,
                        github: data[i].github,
                        grade: data[i].grade,
                    }
                    temp.push(d);
                }
                this.props.addGroup(temp);
            })
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
                <Fab color="primary" aria-label="Add" className={classes.fab} onClick={click}>
                        <AddIcon/>
                        <input type='file' 
                            accept='.json' 
                            className={classes.input}
                            id='input' 
                            onChange={e => handleFileChosen(e.target.files[0])}
                        />
                </Fab>
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
                <div className={classes.groups}>
                {this.props.group.map((g,i)=>{
                    return(
                        <div key={i} className={classes.container}>
                            <Paper elevation={1} className={classes.group}>
                                <Paper elevation={3} className={classes.extra}>
                                    <div className={classes.grade}>
                                        {g.grade}
                                    </div>
                                </Paper>
                                <Typography variant="caption" gutterBottom className={classes.title}>
                                    组名
                                </Typography>
                                <Divider className={classes.divider}/>
                                <Typography  gutterBottom className={classes.groupName}>
                                    {g.title}
                                </Typography>
                            </Paper>
                        </div>
                    )
                })}
                
                <div className={classes.add}>
                    {this.ImportFile(classes)}
                </div>
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
      addGroup(data){
        dispatch({type:'GET_GROUP',data});
      }
    }
}

Group.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Group));