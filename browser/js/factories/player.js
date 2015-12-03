app.factory('PlayerFactory',function($q, $http) {
  var audio = document.createElement('audio');
  var currentSong = null;
  var playing = false;
  var album;

  $http.get('/api/albums/')
  .then(res => $http.get('/api/albums/' + res.data[1]._id))
  .then(res => res.data)
  .then(anAlbum => {
    console.log("anAlbum : ", anAlbum);
    anAlbum.imageUrl = '/api/albums/' + anAlbum._id + '.image';
    anAlbum.songs.forEach(function(song){
      song.audioUrl = '/api/songs/' + song._id + '.audio';
    });
    album = anAlbum;
    console.log("album within promise: ", album);
  })
  .catch(console.error.bind(console));
  
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
    var idx = album.indexOf(currentSong);
    console.log(idx);
    return idx = mod( (idx + (val || 1)), album.length );
  };

  return {
    getAlbum: function(){
      console.log("getAlbum: ", album);
      return album;
    },
    start: function(song, songs) {
      // console.log('ADSLKFJALS;KFJASDLKFJALK;SJ');
      this.pause();
      if(songs) album = songs;
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
      this.start(album[index]);
    },
    previous: function() {
      var index = skip(-1);
      this.start(album[index]);
    },
    getProgress: function() {
      return playing ? audio.currentTime / audio.duration : 0;
    }
  }
});