import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import axios from 'axios';
// import config from '../../config';

const styles = theme => ({
    table: {
        width: '90%',
        margin: '0 auto 0 auto',
    },
    root: {
        overflowY: 'auto',
    }
})

const CustomTableCell = withStyles(theme => ({
    head: {
        fontSize: '1em',
        color: 'black',
    },
    body: {

    },
  }))(TableCell);

class DetailTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableData: [],
        }
    }

    componentWillMount(){
        let audits = this.props.audits;
        let tableData = [];

        audits.map((name,i) => {
            tableData.push(this.createData(name,0,0,0,0,0,0));
            return 1;
        })
        this.setState({tableData});
    }

    createData = (name, reply, ui, func, team, code, sum) =>{
        return {name, reply, ui, func, team, code, sum}
    }

    find = (name) => {
        let index = -1;
        let data = this.state.tableData;

        for(let i=0;i<data.length;i++){
            let temp = data[i];

            if(temp.name === name){
                index = i;
                break;
            }
        }
        return index;
    }

    componentDidMount(){
        let {socket} = this.props;
        
        socket.on('showScore', (result)=>{
            let {name, score, avg} = result;
            let index = this.find(name);

            if(index !== -1){
                let temp = this.state.tableData;
  
                temp[index].reply = score[1];
                temp[index].ui = score[2];
                temp[index].func = score[3];
                temp[index].team = score[4];
                temp[index].code = score[5];
                temp[index].sum = avg;

                this.setState({
                    tableData: temp,
                })
            }
        })
    }

    render(){
        const {classes} = this.props;

        return(
            <div className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <CustomTableCell>组名</CustomTableCell>
                    <CustomTableCell>答辩</CustomTableCell>
                    <CustomTableCell>界面</CustomTableCell>
                    <CustomTableCell>功能</CustomTableCell>
                    <CustomTableCell>团队</CustomTableCell>
                    <CustomTableCell>代码</CustomTableCell>
                    <CustomTableCell align="right">总分</CustomTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.tableData.map((row,i) =>{
                        return(
                            <TableRow key={i}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.reply}</TableCell>
                                <TableCell>{row.ui}</TableCell>
                                <TableCell>{row.func}</TableCell>
                                <TableCell>{row.team}</TableCell>
                                <TableCell>{row.code}</TableCell>
                                <TableCell align="right">{row.sum}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
      audits: state.audits,
    }
}
  
function mapDispatchToProps(dispatch){
    return {
      
    }
}

DetailTable.propTypes = {
    classes: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(DetailTable));