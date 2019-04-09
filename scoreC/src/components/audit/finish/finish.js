import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../config';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const styles = theme =>({
    root: {
        height: 750,
        overflowY: 'auto',
    },
    main: {
        width: 1216,
        height: 'auto',
        minHeight: '650px',
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '80px auto 0 159px',
        textAlign: 'left',
    },
    head: {
        width: 1186,
        height: 84,
        backgroundColor: '#aa00ff',
        position: 'relative',
        left: '15px',
        top: '-30px',
        textAlign: 'center',
    },
    title: {
        color: 'white',
        fontSize: '1.5em',
        position: 'relative',
        top: '15px'
    },
    subtitle: {
        color: 'white',
        position: 'relative',
        top: '15px'
    },
    table: {
        width: '100%',
    },
    tableBody: {
        width: '100%',
    }
})

class Finish extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: {grade:[]},
            value: 1,
            record: [],
        }
    }

    componentWillMount(){
        axios.post(config.URL_S+'finish')
        .then(res =>{
            let data = res.data;

            this.setState({
                data,
                record: data.record,
            })
        })
    }

    render(){
        const {classes, num} = this.props;
        const {record} = this.state;

        return(
            <div className={classes.root}>
                <Paper className={classes.main}>
                <Paper className={classes.head}>
                    <Typography className={classes.title} variant="h5">
                        打分结果
                    </Typography>
                    <Typography className={classes.subtitle} variant="subtitle2">
                        共计有{record.length}个小组完成了评分
                    </Typography>
                </Paper>
                    <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>排名</TableCell>
                            <TableCell>小组作品</TableCell>
                            <TableCell>小组号码</TableCell>
                            <TableCell>小组成员</TableCell>
                            <TableCell>得分</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                        {record.map((o, i) => (
                        o.number === num?
                        <TableRow key={o.id} style={{backgroundColor:'#9ccc65'}}>   
                            <TableCell omponent="th" scope="row">{i + 1}</TableCell>
                            <TableCell>{o.title}</TableCell>
                            <TableCell>{o.number}</TableCell>
                            <TableCell>{o.member}</TableCell>
                            <TableCell>{o.score}</TableCell>
                        </TableRow>:
                        <TableRow key={o.id}>   
                            <TableCell omponent="th" scope="row">{i + 1}</TableCell>
                            <TableCell>{o.title}</TableCell>
                            <TableCell>{o.number}</TableCell>
                            <TableCell>{o.member}</TableCell>
                            <TableCell>{o.score}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
      record: state.record,
      num: state.number,
    }
}
  
function mapDispatchToProps(dispatch){
    return {
      
    }
}

Finish.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Finish));