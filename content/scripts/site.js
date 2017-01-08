$(function () {
    $('.hc-trump-charts').each(function(i, v){
    Highcharts.chart($(v).attr('id'), {
        title: {
            text: ' ',
            x: -20 //center
        },
        xAxis: {
            categories: $(v).data('instances').map(c => {
                var date = new Date(c.time);
                return `${(date.getMonth() + 1)}-${(date.getDate())}-${(date.getFullYear())} ${(date.getHours())}:${date.getMinutes()}`;
            })
        },
        yAxis: {
            title: {
                text: ' '
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: ' ',
            data: $(v).data('instances').map(c => c.count)
        }]
    });
        
    });
});

//});