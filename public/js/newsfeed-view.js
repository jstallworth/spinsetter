// anonymous, self-invoking function to limit scope
(function() {
  var NewsfeedView = {};

  /* Renders the newsfeed into the given $newsfeed element. */
  NewsfeedView.render = function($newsfeed) {
    PostModel.loadAll(function(error,posts) {
      posts.forEach(function(post) {
        NewsfeedView.renderPost($newsfeed, post, false);
      });
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry({
          columnWidth: '.post',
          itemSelector: '.post'
        });
      });
    });
  };

  /* Given post information, renders a post element into $newsfeed. */
  NewsfeedView.renderPost = function($newsfeed, post, updateMasonry) {
    // TODO
    var postDiv = Templates.renderPost(post);
    $post = $(postDiv);
    $newsfeed.prepend($post);
    $post.find(".remove").click(function() {
      PostModel.remove(post._id, function(error,result) {
        $newsfeed.masonry('remove', $post);
        $newsfeed.masonry();
      });
    });
    $post.find(".upvote").click(function() {
      PostModel.upvote(post._id, function(error,result) {
        $post.find(".upvote-count").html(parseInt($post.find(".upvote-count").html()) + 1);
        console.log(error);
      });
    });
    if (updateMasonry) {
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry('prepended', $post);
      });
    }
  };

  window.NewsfeedView = NewsfeedView;
})();
