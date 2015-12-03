app.factory('PlayerFactory',function($q) {
  var audio = document.createElement('audio');
  var currentSong = null;
  var playing = false;
  var songList;

  audio.addEventListener('ended', function () {
    next();
  });
  audio.addEventListener('timeupdate', function () {
    // $scope.progress = 100 * audio.currentTime / audio.duration;
    // $scope.$digest();
  });

  function mod (num, m) { return ((num%m)+m)%m; };

  // jump `val` spots in album (negative to go back)
  function skip (val) {
    if (!currentSong) return;
    var idx = songList.indexOf(currentSong);
    console.log(idx);
    return idx = mod( (idx + (val || 1)), songList.length );
  };

  return {
    start: function(song, songs) {
      // console.log('ADSLKFJALS;KFJASDLKFJALK;SJ');
      this.pause();
      if(songs) songList = songs.songs;
      playing = true;
      // resume current song
      if (song === currentSong) return audio.play();
      // enable loading new song
      currentSong = song;
      audio.src = song.audioUrl;
      audio.load();
      audio.play();
    },
    pause: function() {
      audio.pause();
      playing = false;
    },
    resume: function() {
      audio.play();
      playing = true;
    },
    isPlaying: function() {
      return playing;
    },
    getCurrentSong: function() {
      return currentSong;
    },
    next: function() {
      var index = skip(1);
      this.start(songList[index]);
    },
    previous: function() {
      //
    },
    getProgress: function() {
      //
    }
  }
})