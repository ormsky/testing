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


var arg = process.argv[2];
console.log(arg);



var config = require('./config');

//var db = 'temp_fr_test';
var db = config.db_database;

//repos.connect(config.db_url, temp_db).then( () =>
//  {
var soc = require('./lib/socket-server.js')(soc_app);

//    require('./lib/socket-server.js')(soc_app, repos);
    soc_app.listen(3001);
//  }
//);

////////////////////////////////////////////
//
// Web Server
//
////////////////////////////////////////////
var web_server = require('./lib/web-server');

var repos = require('./lib/repos-couchdb.js');
repos.connect(config.db_url, db).then( () =>
{
  if (arg == "init") {
    repos.configure();
  }
  web_server.listen(8080,repos);
});


