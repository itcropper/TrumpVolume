
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var occurance = new Schema({
    source: String,
    count: Number
})

module.exports = mongoose.model('occurance', new Schema(    {
    _id: String,
    sourceName: String, 
    average: Number, 
    instances: 
    [{
        count: Number,
        time: Date
    }]
}));