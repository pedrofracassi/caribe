var path = require('path');
var express = require('express');
var app = express();

var staticPath = path.join(__dirname, '/public');
var port = process.env.PORT || 8080;

app.use(express.static(staticPath));

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
