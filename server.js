"use strict";

var http = require('http');
var app = http.createServer();
app.listen(3000);

require('./index.js')(app);

/////////////////////////////////////////////
//
// Adding the functional socket either by:
//
// var io = require('./index.js')(app);
//
// OR
//
// var x = require('./index.js');
// x.createSocket(app);
//
/////////////////////////////////////////////
