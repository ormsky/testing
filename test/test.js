"use strict";

const testPort = 3000;

var http = require('http');
var socket = require('socket.io-client')('http://localhost:'+testPort);
var debug = require('debug')('bfr-test');




var tap = require('tap');


tap.test('test connections', function (childTest) {
  //
  // Create a socket server instance to run the tests against:
  //
  var server = http.createServer();
  var app = server.listen(testPort);
  require('../lib/index.js')(app);

  socket.on('handle', function (data) {
    debug('received handle');
    debug(data);
    childTest.ok( data.handle, 'handle not null' );
  });
  //
  // check that there are two connections:
  //
  socket.on('connections',function (data) {
    debug('received connections');
    debug(data);
    childTest.equal( Object.keys(data).length, 2 );
    socket.off('handle');
    socket.off('connections');
    debug('test over???');
    app.close();
    server.close();
    childTest.end();
    process.exit();
  });
  //
  // do 2 handle requests
  //
  socket.emit('request_handle', { name: 'test' });
  socket.emit('request_handle', { name: 'test2' });
  socket.emit('get_connections');
  debug('xx');
});





/*
//
// if this module was run directly from the command line as in node xxx.js
// then do the test run:
//
if (module == require.main) {
  // Create a socket server instance to run the tests against:
  var app = http.createServer().listen(testPort);
  require('../lib/index.js')(app);

  //debug("If test hangs, then callback functions probably not getting called (treat as failure).");
  require('test').run(exports);
}
*/
