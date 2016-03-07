// anonymous, self-invoking function to limit scope
(function() {
  var PostModel = {};

  var POSTS_URL= '/posts';


  /**
   * Loads all newsfeed posts from the server.
   *
   * Calls: callback(error, posts)
   *  error -- the error that occurred or null if no error occurred
   *  results -- an array of newsfeed posts
   */
  PostModel.loadAll = function(callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
      var error = null;
      if (this.status != 200) {
        error = this.statusText;
      }
      var response = this.response;
      callback(error, JSON.parse(response));
    });
    request.open("GET", POSTS_URL);
    request.setRequestHeader('Content-type', 'application/json');
    request.send();
  };

  /* Adds the given post to the list of posts. The post must *not* have
   * an _id associated with it.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the post added, with an _id attribute
   */
  PostModel.add = function(post, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
      var error = null;
      if (this.status != 200) {
        error = this.statusText;
      }
      var response = this.response;
      callback(error, JSON.parse(response));
    });
    request.open("POST", POSTS_URL);
    var postString = "title="+post.title+"&api="+post.api+"&source="+post.source;
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(post));
  };

  /* Removes the post with the given id.
   *
   * Calls: callback(error)
   *  error -- the error that occurred or null if no error occurred
   */
  PostModel.remove = function(id, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
      var error = null;
      if (this.status != 200) {
        error = this.statusText;
      }
      var response = this.response;
      callback(error, response);
    });
    request.open("POST", POSTS_URL + "/remove");
    request.setRequestHeader('Content-type', 'application/json');
    var idObj = {};
    idObj.id = id;
    request.send(JSON.stringify(idObj));
  };

  /* Upvotes the post with the given id.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the updated post model
   */
  PostModel.upvote = function(id, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
      var error = null;
      if (this.status != 200) {
        error = this.statusText;
      }
      var response = this.response;
      callback(error, JSON.parse(response));
    });
    request.open("POST", POSTS_URL + "/upvote");
    request.setRequestHeader('Content-type', 'application/json');
    var idObj = {};
    idObj.id = id;
    request.send(JSON.stringify(idObj));
  };

  window.PostModel = PostModel;
})();
