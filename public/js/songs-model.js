(function() {
  
  SC.initialize({
    client_id: '8d8d92a38c9c0b046cf85d44d5625a27',
    redirect_uri: '/'
  });

  var THRESHOLD = 100;
  var SongStream = {};
  SongStream.urls = new Array();
  SongStream.extras = new Array();
  SongStream.push = addSong(THRESHOLD);
  SongStream.playlist = new Array;
  SongStream.currentIndex = 0;

  SongStream.next = function() {
    SongStream.currentIndex++;
    playSong(SongStream.playlist[SongStream.currentIndex]);
  }

  SongStream.previous = function() {
    SongStream.currentIndex--;
    playSong(SongStream.playlist[SongStream.currentIndex]);
  }

  SongStream.pause = function() {
    
  }

  //closure to limit number of songs to stream from twitter
  function addSong(threshhold) {
    var count = 1;
    var add = function(tweet) {
      //avoid duplicates
      if(!SongStream.urls.includes(tweet.entities.urls[0].expanded_url)) {
        var song = new Post(tweet);
        var $post = song.htmlStr();
        if(count <= threshhold) {
          $('#wrap').append($post);
          SongStream.playlist.push(song);
          count++;
        } else {
          SongStream.extras.push($post);
        }
      }
    }
    return add;
  }

  var socket = io.connect('http://localhost:3000');

  socket.on('stream', function(tweet){
    SongStream.push(tweet);
    SongStream.urls.push(tweet.entities.urls[0].expanded_url);
  });

  //get the square album art from soundcloud
  function getSquare(str) {
    if(str) {
      str = str.split('large.jpg')[0]+'t500x500.jpg';
    } else {
      str = '/images/default1.png'
    }
    return str;
  }

  //create a song post from the tweet data
  function Post(tweet) {
    if(this instanceof Post) {
      this.user = tweet.user;
      this.entities = tweet.entities;
      this.text = tweet.text;
      var _this = this;
      this.track = null;
      this.htmlStr = function() {
        var $postContainer = $('<div></div>');
        $postContainer.addClass('PostContainer');
        var $usernameContainer = $('<div></div>');
        $usernameContainer.html('<p>'+this.user.screen_name+'</p><p>'+tweet.id_str+'</p>');
        var $img = $('<div></div>');
        $img.addClass('albumArt');
        var $title = $('<div></div>');
        $title.addClass('title');
        SC.resolve(this.entities.urls[0].expanded_url).then(function(song) {
          $title.text(song.title);
          $img.css("background-image", "url("+getSquare(song.artwork_url)+")");
          _this.track = 'tracks/'+song.id;
          $postContainer.on('click',function() {
            playSong(_this);
          });
        }).catch(function(err) {
          $postContainer.remove();
        });
        $postContainer.append($img);
        var $textContainer = $('<div></div>');
        $textContainer.html('<p>'+this.text+'</p>');
        return $postContainer;
      }
    } else {
      console.log('incorrect constructor, use new keyword');
      return new Post(tweet);
    }
  } 

  //stream the song from soundcloud
  function playSong(song) {
    SongStream.currentIndex = SongStream.playlist.indexOf(song);
    console.log(SongStream.currentIndex);
    SC.stream(song.track).then(function(player){
      console.log(player);
      //make it work in chrome without flash
      if (player.options.protocols[0] === 'rtmp') {
          player.options.protocols.splice(0, 1);
      }
      player.play();
      player.on('finish', SongStream.next);
    });
  }

  //get live stream of tweets with soundcloud links in a certain location (lat,long)
  SongStream.streamTweets = function(location,callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load',function() {
      callback(this.response);
    });
    request.open('GET','/tweets?location='+location);
    request.setRequestHeader('Content-type','application/json');
    request.send();
  };
  window.SongStream = SongStream;
})();