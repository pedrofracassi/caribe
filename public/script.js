var exampleSocket = new WebSocket("ws://localhost:9090/");
var music = new Audio('pirates.mp3');

exampleSocket.onopen = function (event) {
  exampleSocket.send("Connected");
};

function startDownload() {
  var url = $('#textbox-url').val();
  if (isYoutubeUrl(url)) {
    music.play();
    $('#btn-start').html('<i class="fa fa-spinner fa-spin"></i> Pirateando');
    $('#div-notyoutube').attr('style', 'display: none');
    $('#textbox-url').attr('disabled', 'true');
    $('#btn-start').attr('disabled', 'true');
    exampleSocket.send({type: 'startDownload', url: url});
    console.log('Válido');
  } else {
    $('#div-notyoutube').attr('style', 'display: block');
    console.log('Nope');
  }
}

// Thanks to Jitendra Pancholi from StackOverflow for this function
function isYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}
