var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Twitter = require('twitter');



//Authenticate with Twitter
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.AUTH_TOKEN,
  access_token_secret: process.env.AUTH_TOKEN_SECRET,
});


var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

//make sure the tweet has a soundcloud link in it
function validateTweet(tweet) {
  var containsSC = new RegExp(/\/soundcloud.com\/([a-zA-Z0-9_-])+\/([a-zA-Z0-9_-])+/);
  if(!tweet.entities || !tweet.entities.urls[0]) return false;
  return containsSC.test(tweet.entities.urls[0].expanded_url);
}

// serve all files out of public folder
app.use(express.static('public'));

//stream all of the tweets
app.get('/tweets', function (req, res) {
  var tweets = client.stream('statuses/filter', {track: 'soundcloud',location: req.location} , function(stream) {
      stream.on('data',function(tweet) {
        if(validateTweet(tweet)) io.sockets.emit('stream',tweet);
      });
      stream.on('error',function(error) {
        console.log(error + '');
      });
    });
  res.send('ya');
  
});

// parse json bodies in post requests
app.use(bodyParser.json());


server.listen(3000);
console.log('Listening at 127.0.0.1:' + 3000);