var config_line={
	chart: {
        type: 'bar',
        height: 600,
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: [],
        title:{
        	text:'组别'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '总分'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
            }
        }
    },
    legend: {
        reversed: true
    },
    sum:[],
    plotOptions: {
        series: {
            stacking: 'normal',
            dataLabels: {
                style: {
                    textOutline: 'none'
                }
            }
        }
    },
    tooltip: {
        pointFormat: '{series.name}: {point.y}'
    },
    series: [{
        name: '得分',
        data: []
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }
}

export default config_line;