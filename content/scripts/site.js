$(function () {
    var hc = function(){
        $('.hc-trump-charts').each(function(i, v){
            var instances = $(v).data('instances')
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
            Highcharts.chart($(v).attr('id'), {
                title: {
                    text: ' ',
                    x: -20 //center
                },
                xAxis: {
                    categories: instances.map(c => {
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
    };
    
    hc();
    
    $('.sort-by').on('change', (e) => {
        $.ajax({
            url:"./cards/"+$(e.target).val(),
            method: "GET"
        }).done((result, status, xhr) => {
            $('.base-grid').replaceWith(result);
            hc();
        })
    });
});

