var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://localhost:27017/callback-newsfeed-db');

var app = express();
// serve all files out of public folder
app.use(express.static('public'));

// parse json bodies in post requests
app.use(bodyParser.json());

var soundcloud = require('./lib/soundcloud.js');
var youtube = require('./lib/youtube.js');
var flickr = require('./lib/flickr.js');


// TODO: api routes
app.get('/search', function (req, res) {
  var searchResults = [];
  var query = req.query.query;
  var count = 0;
  soundcloud.search(query, function(error,results) { 
    results[0].api = "soundcloud";
    searchResults.push(results[0]);
    count++;
    if(count == 3) res.json(200, searchResults);
  });
  youtube.search(query, function(error,results) { 
    results[0].api = "youtube";
    searchResults.push(results[0]);
    count++;
    if(count == 3) res.json(200, searchResults);
  });
  flickr.search(query, function(error,results) { 
    results[0].api = "flickr";
    searchResults.push(results[0]);
    count++;
    if(count == 3) res.json(200, searchResults);
  });
  //res.send('Hello from the other siide');
});

app.listen(3000);
console.log('Listening at 127.0.0.1:' + 3000);
