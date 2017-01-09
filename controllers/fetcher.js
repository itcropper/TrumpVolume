var mongoose = require('mongoose'),
    sources = require('../statics/sources'),
    request = require('request'),
    cheerio = require('cheerio'),
    NewsSave = require('../models/newsOccurances'),
    Promise = require('promise'),
    http = require('http');


var sixHours = 1000 * 60 * 60 * 6;

var getCount = function(text, cb, word = " Trump") {
    var substrings = text.split(word);
    cb(substrings.length - 1);
}

function start() {

    var run = () => {

        var time = new Date();

        sources.map(src => {
            request(src.url, (error, response, html) => {
                if (!error) {
                    var $ = cheerio.load(html);
                    getCount($('body').text(), (count) => {

                        var instance = {
                            count: count, 
                            time: time
                        };

                        NewsSave.findOneAndUpdate({
                                _id: src.url
                            }, {
                                "$push": {
                                    "instances": {
                                        $each: [instance],
                                        $sort: {date: 1},
                                        $slice: -24
                                    },
                                    
                                },
                                $setOnInsert: {
                                    "sourceName": src.name,
                                    "_id": src.url
                                },
                            }, {
                                upsert: true,
                                new: true,
                                setDefaultsOnInsert: true
                            },
                            (err, data) => console.log('>>>data ' + (err || data.sourceName))
                        );
                    });
                }
            });

        });
    };

    var intv = setInterval(run, sixHours);

    run();
}

function getInstances(req, res) {
    NewsSave
        .find({})
        .exec(function(err, resp) {
            if (err) { 
                res.json(err)
            } else {
                res.json(resp);
            }
        });

}

function getDisplay(render, sorter = "count"){
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    NewsSave
    .find({})
    .exec((err, data) => {
        if(err){
            return console.log(err);
        }
        var day = 1000 * 60 * 60 * 24;
        var d = data.map((m) => {
            var time = m.instances[m.instances.length - 1].time,
                daySpan = (months[time.getMonth() + 1])+ " "+ (time.getDate() - 1) + ", " + time.getFullYear();
            return {
                src: m._id,
                name: m.sourceName,
                count : (m.instances.length ? m.instances[0].count : 0),
                average: (m.instances.reduce((p, c) => p + c.count, 0) / m.instances.length).toFixed(2),
                span: daySpan,
                instances: m.instances.map(n => ({time: n.time, count: n.count})).reverse()
                
            };
        }).sort((a, b) => {
            if(sorter == "average"){
                return b.average - a.average;
            }
            return b.count - a.count;  
        });
        render(d);
    });
}

module.exports = {
    start: start, 
    fetch: getInstances,
    display: getDisplay
}