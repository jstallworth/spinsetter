var request = require('request');

var SC_URL = 'https://api.soundcloud.com/tracks.json';
var SC_CLIENT_ID = '1c3aeb3f91390630d351f3c708148086';
var SC_EMBED_URL = 'https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F';

/**
 * Queries SoundCloud for tracks that match the given query.
 *
 * @param query -- the search query to send to SoundCloud
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
module.exports.search = function(query, callback) {
  request({
    url: SC_URL, 
    qs: {client_id: SC_CLIENT_ID, q: query},
    method: 'GET'
  }, function (error, resp, body) {
  if (!error && resp.statusCode == 200) {
      var response = body;
      var results = [];
      response = JSON.parse(response);
      response.forEach(function(song) {
        var songObj = {
          title: song.title,
          source: SC_EMBED_URL + song.id
        };
        results.push(songObj);
      });
      callback(null, results);
    } else {
      var error = resp.statusCode;
      callback(error,null);
    }
  });
};
