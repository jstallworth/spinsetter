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
    var postDiv = Templates.renderPost(post);
    $post = $(postDiv);
    $newsfeed.prepend($post);
    $post.find(".remove").click(function() {
      $newsfeed.masonry('remove', $(this).parent().parent().parent().get(0)); //remove the clicked post
      $newsfeed.masonry();
      PostModel.remove(post._id, function(error,result) {
        if(error) $(".error").html(error);
      });
    });
    $post.find(".upvote").click(function() {
      $(this).find(".upvote-count").html(parseInt($(this).find(".upvote-count").html()) + 1); // increment the clicked post's count
      PostModel.upvote(post._id, function(error,result) {
        if(error) $(".error").html(error);
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
