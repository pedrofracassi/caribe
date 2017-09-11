function startDownload() {
  var audio = new Audio('pirates.mp3');
  audio.play();
  $('#btn-start').html('<i class="fa fa-spinner fa-spin"></i> Pirateando');
  $('#btn-start').attr('disabled', 'true');
}
