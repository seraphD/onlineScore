import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
    table: {
        width: '90%',
        margin: '55px auto 0 auto',
    },
    body: {
        fontSize: '1em',
    },
    root: {
        overflowY: 'auto',
    },
    login: {
        width: '80px',
        height: '20px',
        display: 'inline-block',
        backgroundColor: '#4caf50',
    },
    logout: {
        width: '80px',
        height: '20px',
        display: 'inline-block',
        backgroundColor: '#dd2c00',
    }
})

const CustomTableCell = withStyles(theme => ({
    head: {
        fontSize: '1em',
        color: 'black',
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

        audits.map((audit,i) => {
            tableData.push(this.createData(audit.name,0,0,0,0,0,0,false,true));
            return 1;
        })
        this.setState({tableData});
    }

    createData = (name, reply, ui, func, team, code, sum, confirm, online) =>{
        return {name, reply, ui, func, team, code, sum, confirm, online}
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
            let {name, score, ave} = result;
            let index = this.find(name);

            if(index !== -1){
                let temp = this.state.tableData;
  
                temp[index].reply = score[1];
                temp[index].ui = score[2];
                temp[index].func = score[3];
                temp[index].team = score[4];
                temp[index].code = score[5];
                temp[index].sum = ave;
                temp[index].confirm = true;

                this.setState({
                    tableData: temp,
                })
            }
        })

        socket.on('auditDis', (o)=>{
            let {index} = o;
            
            let temp = this.state.tableData;
            if(index > 0){
                temp[index-1].online = false;
            }

            this.setState({
                tableData: temp,
            })
        })

        socket.on('newAudit', (o)=>{
            let index = this.find(o);

            if(index !== -1){
                let temp = this.state.tableData;
                temp[index].online = true;

                this.setState({
                    tableData: temp,
                })
            }
        })

        socket.on('askContinue', (name)=>{
            let index = this.find(name);
            let ans = this.state.tableData[index].confirm;

            socket.emit('ansContinue', {name,ans});
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
                    <CustomTableCell align="center">在线</CustomTableCell>
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
                                <TableCell align="left">
                                    {row.online? 
                                        <div className={classes.login}/>:
                                        <div className={classes.logout}/>}
                                </TableCell>
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