import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../config';
import configLine from './charts/lineConfig';
import configPie from './charts/pieCharts';
import ReactHighcharts from 'react-highcharts';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const HighchartsExporting = require('highcharts-exporting')
HighchartsExporting(ReactHighcharts.Highcharts)
require('highcharts-export-csv')(ReactHighcharts.Highcharts)

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
        margin: '80px auto 0 15px',
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
    tab: {
        fontSize: '1em',
    }
})

class Finish extends Component{
    constructor(props){
        super(props);
        this.state = {
            chartsData: configLine,
            pie: configPie,
            data: {grade:[]},
            value: 1,
        }
    }

    componentWillMount(){
        axios.post(config.URL_S+'finish')
        .then(res =>{
            let data = res.data;
            let {highRate, wellRate, middleRate, passRate} = data;
            let temp = configLine;
            let pie = configPie;

            temp.xAxis.categories = data.catagory;
            temp.series[0].data = data.grade;
            temp.title.text = '成绩统计';
            temp.chart.height = data.grade.length * 80;

            pie.title = "各分数段人数比例";
            pie.series.data = [];
            pie.series[0].data.push({
                name:'优秀',
                y: highRate * 100,
            })
            pie.series[0].data.push({
                name: "良好",
                y: wellRate * 100,
            })
            pie.series[0].data.push({
                name: "中等",
                y: middleRate * 100,
            })
            pie.series[0].data.push({
                name: "及格",
                y: passRate * 100,
            })

            this.setState({
                chartsData: temp,
                pieData: pie,
                data
            })
        })
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render(){
        const {classes} = this.props;
        const {value} = this.state;

        return(
            <div className={classes.root}>
                <Paper className={classes.main}>
                <Paper className={classes.head}>
                    <Typography className={classes.title} variant="h5">
                        打分结果
                    </Typography>
                    <Typography className={classes.subtitle} variant="subtitle2">
                        共计有{this.state.data.grade.length}个小组完成了评分
                    </Typography>
                </Paper>
                <Tabs value={value} onChange={this.handleChange} textColor="primary" indicatorColor="primary">
                    <Tab value={1} label="得分总览" className={classes.tab}/>
                    <Tab value={2} label="得分比例" className={classes.tab}/>
                </Tabs>
                <div style={{width: '100%'}}>
                    {value === 1 && <ReactHighcharts config={this.state.chartsData}></ReactHighcharts>}
                    {value === 2 && <ReactHighcharts config={this.state.pieData}></ReactHighcharts>}
                </div>
                </Paper>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
      
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