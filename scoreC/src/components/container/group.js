import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const styles = theme =>({
    root:{
        margin: '80px 0 0 0',
    },
    group: {
        width: 270,
        height: 120,
        display: 'inline-block',
        margin: '0 20px 30px 20px',
    },
    container: {
        display: 'inline-block',
    },
    extra: {
        width: '30%',
        height: 80,
        position: 'relative',
        display: 'inline-block',
        left: '8%',
        top: -20,
        backgroundColor: '#66bb6a'
    },
    title: {
        width: '60%',
        fontSize: '0.9em',
        position: 'relative',
        display: 'inline-block',
        left: '30px',
        // top: '-50px',
        fontStyle: 'bold',
    },
    grade: {
        fontSize: '1.2em',
        width: '20px',
        margin: '25px auto 0 auto',
    },
    number: {
        width: '60%',
        margin: 'auto',
    }
})

class Group extends Component{
    componentDidMount(){
        
    }

    render(){
        const {classes} = this.props;

        return(
            <div className={classes.root}>
                {this.props.group.map((g,i)=>{
                    return(
                        <div key={i} className={classes.container}>
                            <Paper elevation={1} className={classes.group}>
                                <Paper elevation={3} className={classes.extra}>
                                    <div className={classes.grade}>
                                        {g.grade}
                                    </div>
                                </Paper>
                                <Typography variant="h5" component="h3" className={classes.title}>
                                {g.title}
                                </Typography>
                                <Typography variant="h5" component="h3" className={classes.number}>
                                    {g.number}
                                </Typography>
                            </Paper>
                        </div>
                    )
                })}
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
      
    }
}

Group.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Group));