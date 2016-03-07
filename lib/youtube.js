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
  request({
    url: YT_URL, 
    qs: {key: YT_API_KEY, q: query, part:"snippet", type: "video"},
    method: 'GET'
  }, function (error, resp, body) {
  if (!error && resp.statusCode == 200) {
      var response = body;
      var results = [];
      response = JSON.parse(response).items;
      response.forEach(function(video) {
        var vidObj = {
          title: video.snippet.title,
          source: YT_EMBED_URL + video.id.videoId
        };
        results.push(vidObj);
      });
      callback(null, results);
    } else {
      var error = resp.statusCode;
      callback(error,null);
    }
  });
};