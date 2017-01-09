$(function () {
    

    function formatAMPM(date, callback) {
      var hours = date.getHours(),
          minutes = date.getMinutes(),
          ampm = hours >= 12 ? 'pm' : 'am',
          strTime = '';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
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
                        return `${months[date.getMonth() + 1]} ${(date.getDate())}, ${formatAMPM(date)}`;
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

