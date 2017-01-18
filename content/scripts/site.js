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
    
    function roundMinutes(date) {

        date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
        date.setMinutes(0);

        return date;
    }    
    
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var bigChart = null;
    var sidebyside = function(){
        
        var highestCount = Math.max.apply(Math, $('.hc-all-sources').data('instances').map((v, i) => 
                              Math.max.apply(Math, v.instances.map((val, index) => 
                                val.count))));
        
        var instances = $('.hc-all-sources').data('instances')
            .map(a => {
                return {
                    name: a.name,
                    data: a.instances.map(m => m.count)
                };
            }),
            times = $('.hc-all-sources').data('instances')[0].instances.map(a => roundMinutes(new Date(a.time)));
        
            
        bigChart = Highcharts.chart($('.hc-all-sources').attr('id'), {
            title: {
                text: ' ',
                x: -20 //center
            },
            xAxis: {
                categories: times.map(c => `${months[c.getMonth() + 1]} ${(c.getDate())}, ${formatAMPM(c)}`)
            },
            yAxis: {
                title: {
                    text: ' '
                },
                min:0,
                max:highestCount,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series:instances
        });

    }
    sidebyside();
    
    var hc = function(){
        
        var highestCount = Math.max.apply(Math, $('.hc-trump-charts').map((i, v) => 
                              Math.max.apply(Math, $(v).data('instances').map((val, index) => 
                                val.count))));
        
        $('.hc-trump-charts').each(function(i, v){
            var instances = $(v).data('instances')
                .map(a => a.time.getMonth ? a : {time: new Date(a.time), count: a.count})
                .sort((a,b) => a.time.getTime() - b.time.getTime());
            Highcharts.chart($(v).attr('id'), {
                title: {
                    text: ' ',
                    x: -20 //center
                },
                xAxis: {
                    categories: instances.map(c => `${months[c.time.getMonth() + 1]} ${(c.time.getDate())}, ${formatAMPM(c.time)}`)
                },
                yAxis: {
                    title: {
                        text: ' '
                    },
                    min:0,
                    max:highestCount,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
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
    
    $('.view-option button').on('click', (e) => {
       if($(e.currentTarget).hasClass('aggregate')){
           $(e.currentTarget).addClass("button-error");
           $(e.currentTarget).siblings('button').removeClass("button-error");
           $('.pure-g.base-grid').addClass('hidden');
           $('.side-by-side').removeClass('hidden');
       }else{
           $(e.currentTarget).addClass("button-error");
           $(e.currentTarget).siblings('button').removeClass("button-error");
           $('.pure-g.base-grid').removeClass('hidden');
           $('.side-by-side').addClass('hidden');
       }
        bigChart.reflow();
    });
    
});

