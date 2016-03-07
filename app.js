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

var Post = require('./lib/post.js');

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
});

app.get('/posts', function (req, res) {
  Post.find(function(error,  posts) {
    if (error) {
      throw error;
    }
    res.send(JSON.stringify(posts));
  });
});

app.post('/posts', function(req, res) {
    var api = req.body.api;
    var source = req.body.source;
    var title = req.body.title;
    if(api && source && title) {
        var post = new Post({
          title: title,
          api: api,
          source: source,
          upvotes: 0
        });

        // save the person to Mongo
        post.save(function(error) {
          if (error) {
            throw error;
          }
          res.send(JSON.stringify(post));
        });
    } else {
      res.status(422);
      var error = "Not enough parameters";
      res.send(error);
    }
});

app.post('/posts/remove', function(req, res) {
  var id = req.body.id;
  Post.findByIdAndRemove(id, function(error) {
    if (error) {
      throw error;
    }
    res.send();
  });
});

app.post('/posts/upvote', function(req, res) {
  var id = req.body.id;
  Post.findById(id, function(error,post) {
    if (error) {
      throw error;
    }
    post.upvotes = post.upvotes + 1;

    // write these changes to the database
    post.save(function(error) {
      if (error) {
        throw error;
      }
      res.send(JSON.stringify(post));
    });
  });
});


app.listen(3000);
console.log('Listening at 127.0.0.1:' + 3000);
