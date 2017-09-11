var path = require('path');
var express = require('express');

var express = express();

var staticPath = path.join(__dirname, '/public');

express.use(express.static(staticPath));

express.listen(80, function() {
  console.log('Listening! :D');
});
