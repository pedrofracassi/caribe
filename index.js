const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const ffmpeg = require('ffmpeg');
const sanitize = require("sanitize-filename");

const staticPath = path.join(__dirname, '/public');
const port = process.env.PORT || 8080;

var mp3_dir = './public/mp3';
var mp4_dir = './public/mp4';

if (!fs.existsSync(mp3_dir)) fs.mkdirSync(mp3_dir);
if (!fs.existsSync(mp4_dir)) fs.mkdirSync(mp4_dir);

const server = express().use(express.static(staticPath)).listen(port, function() {
  console.log('Listening on port ' + port);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    var json = JSON.parse(message);
    if (json.type == 'startDownload') {
      var video = youtubedl(json.url, ['--format=18'], { cwd: __dirname });

      // Will be called when the download starts.
      video.on('info', function(info) {
        video.__info__ = info; // Yes, I'm injecting stuff into the video object. The famous Brazilian Gambiarra
        console.log('Download started');
        console.log('filename: ' + info.display_id);
        console.log('size: ' + info.size);
        video.pipe(fs.createWriteStream(__dirname + '/public/mp4/' + parseFileName(info.display_id + '.mp4')));
      });

      // Will be called when the download ends (duh)
      video.on('end', function complete() {
        console.log('Download finished!');
        try {
          var parsedFileName = parseFileName(video.__info__.display_id + '.mp4');
          console.log('Filename: ' + parsedFileName);
          var process = new ffmpeg('public/mp4/' + parsedFileName);
          process.then(function (newvideo) {
            newvideo.fnExtractSoundToMP3('public/mp3/' + parsedFileName.replace('mp4', 'mp3'), function (error, file) {
              if (!error) {
                console.log('Audio file: ' + file);
                var success = {
                  type: 'conversionFinished',
                  downloadUrl: 'mp3/' + parsedFileName.replace('mp4', 'mp3'),
                  thumbnailUrl: video.__info__.thumbnail,
                  videoName: video.__info__.fulltitle
                }
                ws.send(JSON.stringify(success));
              } else {
                var error = {
                  type: 'error',
                  message: 'Houve um erro ao converter o vídeo para mp3.' + error
                }
                ws.send(JSON.stringify(error));
              }
            });
          }, function (err) {
            var error = {
              type: 'error',
              message: 'Erro ao converter o vídeo: ' + err
            }
            ws.send(JSON.stringify(error));
          });
        } catch (e) {
          var error = {
            type: 'error',
            message: 'FFMPEG ' + e.code + ': ' + e.msg
          }
          ws.send(JSON.stringify(error));
        }
      });
    }
  });
});

function parseFileName(name) {
  return sanitize(name.split(' ').join('_').split('&').join('_'));
}
