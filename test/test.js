"use strict";

const testPort = 3000;

var http = require('http');
var socket = require('socket.io-client')('http://localhost:'+testPort);
var debug = require('debug')('bfr-test');


exports['test connections'] = function (assert,done) {
  socket.on('handle', function (data) {
    debug('received handle');
    debug(data);
    assert.ok( data.handle, 'handle not null' );
  });
  //
  // do 2 handle requests
  //
  socket.emit('request_handle', { name: 'test' });
  socket.emit('request_handle', { name: 'test2' });
  //
  // check that we now have two connections:
  //
  socket.on('connections',function (data) {
    debug('received connections');
    debug(data);
    assert.equal( Object.keys(data).length, 2 );
    socket.off('handle');
    socket.off('connections');
    done();
  });
  socket.emit('get_connections');
  debug('xx');
}



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

