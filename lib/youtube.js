var request = require('request');

var YT_URL = 'https://www.googleapis.com/youtube/v3/search';
var YT_API_KEY = 'AIzaSyDDP01Gnj3-wfoqM59xQz6pryJQhmYWCt8';
var YT_EMBED_URL = 'http://www.youtube.com/embed/';

/**
 * Queries YouTube for videos that match the given query.
 *
 * @param query -- the search query to send to YouTube
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
module.exports.search = function(query, callback) {
  var vidUrl = YT_URL + "?key=" + YT_API_KEY + "&q=" + query + "&part=snippet&type=video";
  request(vidUrl, function (error, response2, body) {
  if (!error && response2.statusCode == 200) {
      var response = body;
      var vidObj = {};
      var results = [];
      response = JSON.parse(response).items;
      response.forEach(function(video) {
        vidObj.title = video.snippet.title;
        vidObj.source = YT_EMBED_URL + video.id.videoId;
        results.unshift(vidObj);
      });
      callback(null, results);
    } else {
      var error = response2.statusCode;
      callback(error);
    }
  });
};
