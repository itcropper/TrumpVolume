var express = require('express'),
    app = express(),
    hb = require('express-handlebars'),
    http = require( "http" ).createServer( app ),
    mongoose = require('mongoose'),
    fetcher = require('./controllers/fetcher');



var hbs = hb.create({
    helpers: {
        JSON2string: function (object) {
            return JSON.stringify(object);
        }
    },
    defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



app.use('/public/styles', express.static(__dirname + '/content/styles'));
app.use('/public/js', express.static(__dirname + '/content/scripts'));
app.use('/public/img', express.static(__dirname + '/content/images'));

var PORT = process.env.PORT || 8000;
var MONGOOSE_PORT =
  process.env.MONGODB_URI ||
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL  || 
  'mongodb://localhost:27017;';

// CONFIG
mongoose.connect(MONGOOSE_PORT, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + MONGOOSE_PORT + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + MONGOOSE_PORT);
    fetcher.start();
  }
});

app.get('/', function(req, res){
    fetcher.display(data => res.render("home", {sources: data}));
});

app.get('/data',fetcher.fetch);



http.listen(PORT, function(){
    console.log("Listening on 127.0.0.1/8000");
});