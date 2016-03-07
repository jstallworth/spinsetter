var request = require('request');

var FLICKR_URL = 'https://api.flickr.com/services/rest/?';
var FLICKR_API_KEY = '3cffcc97867ea6aaf3d7fa2690f0ae10';

/**
 * Queries Flickr for photos that match the given query.
 *
 * @param query -- the search query to send to Flickr
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
module.exports.search = function(query, callback) {
  request({
    url: FLICKR_URL, 
    qs: {method: "flickr.photos.search", api_key: FLICKR_API_KEY, text: query, format:"json", media: "photos", sort: "relevance", nojsoncallback: "1"},
    method: 'GET'
  }, function (error, resp, body) {
  if (!error && resp.statusCode == 200) {
      var response = body;
      var results = [];
      response = JSON.parse(response).photos.photo;
      response.forEach(function(image) {
        var imgObj = {
          title: image.title,
          source: 'https://farm' + image.farm + '.staticflickr.com/' + image.server + '/' + image.id + '_' + image.secret + '_z.jpg'
        };
        results.push(imgObj);
      });
      callback(null, results);
    } else {
      var error = resp.statusCode;
      callback(error,null);
    }
  });
};
