const path = require('path');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const wss = new WebSocket.Server({ port: 9090 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    if (message.type == 'startDownload') {
      console.log(message.url);
    }
  });
  console.log('New connection!')
  ws.send('something');
});

var staticPath = path.join(__dirname, '/public');
var port = process.env.PORT || 8080;

app.use(express.static(staticPath));

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
