/**
 * Created by Yc on 2016/6/17.
 */

(function(){
    function startChart(elem,option) {
        elem.style.height = (elem.dataset.height || 400) + 'px';
        var chart = echarts.init(elem);
        chart.showLoading('default',{
            text: '加载中...',
            color: '#c23531',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
        });
        chart.setOption(option);
        chart.hideLoading();
    }
    var pie = document.getElementById('pie-chart'),
        line = document.getElementById('sellChange-chart');

    if(!!pie.dataset.chart && pie.dataset.chart!='') {
        var data = JSON.parse(pie.dataset.chart)
        var option = {
            title : {
                text: '周最受欢迎图书',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: data.keys
            },
            series : [
                {
                    name: '周销售量',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:
                        data.keys.map((x,i)=>{
                            return {value:data.data[i],name:x};
                        }),
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        startChart(pie, option);
    }
    else
        pie.innerHTML='<big class="text-danger">没有相关信息</big>';
    if(!!line.dataset.chart && line.dataset.chart!='') {
        var data = JSON.parse(line.dataset.chart);
        var option = {
            title: {
                text: '销售折线图',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['销量']
            },
            dataZoom: [
                {
                    show: true,
                    start: 0,
                    end: 100,
                    handleSize: 8
                },
                {//滚轮
                    type: 'inside',
                    start: 0,
                    end: 100,
                }
            ],
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {},
                    dataView: {readOnly: true},
                    // magicType: {type: ['line']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: data.keys
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} 本'
                    },
                }
            ],
            series: [
                {
                    name: '销量',
                    type: 'line',
                    data: data.data,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        }
        startChart(line,option);
    }
    else
        line.innerHTML='<big class="text-danger">没有相关信息</big>';
}())

/*//line

 */

/*pie

 */