// anonymous, self-invoking function to limit scope
(function() {
  var MainView = {};

  MainView.render = function($body) {
    SongStream.streamTweets("-122.75,36.8,-121.75,37.8", function(tweet) {  
      
    });
    $('#next').click(SongStream.next);
    $('#prev').click(SongStream.prev);
  };

  window.MainView = MainView;
})();