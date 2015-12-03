app.controller('PlayerCtrl', function($scope, $rootScope){

  // initialize audio player
  var audio = document.createElement('audio');
  audio.addEventListener('ended', function () {
    $scope.next();
  });
  audio.addEventListener('timeupdate', function () {
    $scope.progress = 100 * audio.currentTime / audio.duration;
    $scope.$digest();
  });

  // state variables
  $scope.currentSong;
  $scope.playing = false;

  // main toggle
  $scope.toggle = function (song) {
    if ($scope.playing) $rootScope.$broadcast('pause');
    else $rootScope.$broadcast('play', song);
  }

  // incoming events (from Album or toggle)
  $scope.$on('pause', pause);
  $scope.$on('play', play);

  // functionality
  function pause () {
    audio.pause();
    $scope.playing = false;
  }
  function play (event, song){
    // stop existing audio (e.g. other song) in any case
    pause();
    $scope.playing = true;
    // resume current song
    if (song === $scope.currentSong) return audio.play();
    // enable loading new song
    $scope.currentSong = song;
    audio.src = song.audioUrl;
    audio.load();
    audio.play();
  }

  // outgoing events (to Album)
  $scope.next = function(){ $rootScope.$broadcast('next'); };
  $scope.prev = function(){ $rootScope.$broadcast('prev'); };

});
