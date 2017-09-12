var socket = new WebSocket("ws://localhost:9090/");
var music = new Audio('pirates.mp3');

function startDownload() {
  var url = $('#textbox-url').val();
  if (isYoutubeUrl(url)) {
    music.play();
    $('#btn-start').html('<i class="fa fa-spinner fa-spin"></i> Pirateando');
    $('#div-notyoutube').attr('style', 'display: none');
    $('#textbox-url').attr('disabled', 'true');
    $('#btn-start').attr('disabled', 'true');
    var message = {
      type: 'startDownload',
      url: url
    }
    socket.send(JSON.stringify(message));
    console.log('Válido');
  } else {
    $('#textbox-url').val('');
    $('#div-notyoutube').attr('style', 'display: block');
    console.log('Nope');
  }
}

// Thanks to Jitendra Pancholi @ StackOverflow for this function
function isYoutubeUrl(url) {
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if(url.match(p)){
    return url.match(p)[1];
  }
  return false;
}


socket.onmessage = function (event) {
  var message = JSON.parse(event.data);
  resetUI();
  if (message.type == 'conversionFinished') {
    $('#div-downloaded').append(`<a href="${message.downloadUrl}" download="${message.videoName + '.mp3'}"> ${message.videoName} </a>`);
  } else if (message.type == 'error') {
    resetUI();
    console.log(message.message)
    alert(message.message);
  } else {
    resetUI();
    alert('Um erro ocorreu.');
  }
}

function resetUI() {
  $('#btn-start').html('<i class="fa fa-download"></i> Piratear');
  $('#textbox-url').removeAttr('disabled');
  $('#textbox-url').val('');
  $('#btn-start').removeAttr('disabled');
  music.pause();
}
/*
<div class="card" style="width: 20rem;">
<img class="card-img-top" src="..." alt="Card image cap">
<div class="card-body">
<h4 class="card-title">Card title</h4>
<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
<a href="#" class="btn btn-primary">Go somewhere</a>
</div>
</div>
*/
