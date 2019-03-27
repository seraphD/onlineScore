import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import config from '../../config';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import io from 'socket.io-client';

const CustomTableCell = withStyles(theme => ({
    head: {
      color: '#8e24aa',
      fontSize: '1em'
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

const styles = theme =>({
    container: {
        width: '60%',
        minHeight: 400,
        margin: '200px auto 0 auto',
        height: 100,
        textAlign: 'center',
    }, 
    table: {
        width: '100%',
        margin: '100px auto 0 auto',
        position: 'relative',
        left: 100,
    }
})

class Animate extends Component{
    constructor(props){
        super(props);
        this.count = 0;
        this.socket = io(config.URL_S);
        this.state = {
            data: [],
            random: [],
            cur: 0,
            start: true,
            now: 0,
            tableData: [],
            score: true,
        }
    }

    static contextTypes = {
        router: PropTypes.object,
    }

    componentWillMount(){
        axios.post(config.URL_S+"main/getGroup")
        .then(res => {
            let data = res.data;
            this.setState({
                data,
                length: data.length,
            })

            axios.post(config.URL_S+'main/random', {group: data})
            .then(res => {
                let data = res.data.group;

                this.setState({
                    random: data,
                })
                this.animate();
                this.props.setRandomGroup(data);
            })           
        })
    }

    componentDidMount(){
        this.socket.on('watchScore',()=>{
            console.log(1);
            this.setState({
                score: true,
                start: true,
            })
            this.animate();
        })
    }

    animate = () =>{
        if(this.state.score){
            if(this.state.start){
                this.timer = setTimeout(() => {
                    let {length, now, random, data, tableData} = this.state;
                    let pos = parseInt(Math.random() * length);

                    if(data.length > 0 && random.length > 0){
                        if(random[now].title === data[pos].title){
                            let row = {
                                id: now,
                                title: data[pos].title,
                                number: data[pos].number,
                            }
        
                            now += 1;
                            tableData.push(row);
                            this.setState({
                                cur: pos,
                                now,
                                start: false,
                                tableData
                            })
                        }else{
                            this.setState({
                                cur: pos,
                            })
                        }
                    }
                  
                    this.animate();
                }, 100);
            }else{
                this.timer = setTimeout(() => {
                    let {length, now} = this.state;
                    if(now !== length){
                        this.setState({
                            start: true,
                        })
                        this.animate();
                    }else{
                        this.context.router.history.push('/audit');
                    }
                }, 3000);
            }
        }
    }

    render(){
        let {classes} = this.props;
        let {cur, data} = this.state;

        return(
            <div>
                <div className={classes.container}>
                    <Typography className={classes.title} variant="h2">
                        {data.length !== 0?
                            data[cur].title
                            :<div/>}
                    </Typography>
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <CustomTableCell>序号</CustomTableCell>
                            <CustomTableCell>组名</CustomTableCell>
                            <CustomTableCell>小组号码</CustomTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.tableData.map(row =>{
                                return(
                                    <TableRow key={row.id}>
                                        <CustomTableCell>{row.id + 1}</CustomTableCell>
                                        <CustomTableCell>{row.title}</CustomTableCell>
                                        <CustomTableCell>{row.number}</CustomTableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
      
    }
}
  
function mapDispatchToProps(dispatch){
    return {
      setRandomGroup(data){
        dispatch({type:'SET_RANDOM_GROUP',data})
      }
    }
}

Animate.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Animate));