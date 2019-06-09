DlgAvgChart = function (opts) {
    var me = this;
    me._dlg = $("#" + opts.div).html(
            "<div id=\"divChart\" style=\"height: 100%\"></div>"
            ).dialog({
        height: 400,
        width: 400,
        modal: true,
        title: "评分平均值"
    });
    me._init(opts);
};

DlgAvgChart.prototype._init = function (opts) {
    var me = this;
    var data = opts.data;
    var name = opts.name;
    var dom = document.getElementById("divChart");
    var myChart = echarts.init(dom);
    option = null;

    option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {// 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: name,//['环境', '服务', '心情']
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                max: 5
            }
        ],
        series: [
            {
                name: '评分',
                type: 'bar',
                barWidth: '60%',
                data: data//[1, 2.5, 3]
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
};


