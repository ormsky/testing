"use strict";

//const assert = require('assert');

const testPort = 3000;

var http = require('http');
var socket = require('socket.io-client')('http://localhost:'+testPort);
var debug = require('debug')('xx-test');

exports['test request_handle'] = function (assert,done) {
  socket.on('handle',function (data) {
    debug('received handle');
    debug(data);
    assert.notEqual( data, null );
    done();
  });
  socket.emit('request_handle', { id:2 });
}




//assert.equal(2 + 2, 5);
//assert.equal(2 + 2, 5, 'assert failure is logged');
//assert.equal(3 + 2, 5, 'assert pass is logged');
//assert.doesNotThrow( () => { socket.emit('i am', { id:22 }); }, 'xxxx!!!');



// 
// if this module was run directly from the command line as in node xxx.js
// then do the test run:
//
if (module == require.main) {
  var app = http.createServer().listen(testPort);
  require('../lib/index.js')(app);

  console.log("If test hangs, then callback functions probably not getting called (treat as failure).");
  require('test').run(exports);
}

