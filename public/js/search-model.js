// anonymous, self-invoking function to limit scope
(function() {
  var SearchModel = {};

  var SEARCH_URL = '/search';

  /**
   * Loads API search results for a given query.
   *
   * Calls: callback(error, results)
   *  error -- the error that occurred or NULL if no error occurred
   *  results -- an array of search results
   */
  SearchModel.search = function(query, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
      var error = null;
      if (request.status != 200) {
        error = request.statusText;
      }
      var response = request.response;
      callback(error, JSON.parse(response));
    });
    request.open("GET", SEARCH_URL + "?query=" + encodeURIComponent(query));
    request.setRequestHeader('Content-type', 'application/json');
    request.send();
  };
  window.SearchModel = SearchModel;
})();
