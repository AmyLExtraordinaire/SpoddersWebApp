//actual website script

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'))
console.log('listening on 8888');
app.listen(8888);