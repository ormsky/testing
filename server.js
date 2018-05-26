"use strict";


/////////////////////////////////////////////
//
// SOCKET Server
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
var http = require('http');
var soc_app = http.createServer();





var config = require('./config');

const temp_db = 'temp_fr_test';

var repos = require('./lib/repos-couchdb.js');
repos.connect(config.db_url, temp_db).then( () =>
  {
    require('./lib/socket-server.js')(soc_app, repos);
    soc_app.listen(3001);
  }
);

////////////////////////////////////////////
//
// Web Server
//
////////////////////////////////////////////
var web_server = require('./lib/web-server');
web_server.listen(8080,repos);


