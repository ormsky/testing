"use strict";

module.exports = createSocket;
module.exports.createSocket = createSocket;


var connection_number = 1;
var debug=require('debug')('xx');




function createSocket(app, repos) {
  var io = require('socket.io')(app);

  io.on('connection', function (socket) {
    //debug("YOU ARE "+connection_number);
    
    socket.on('my other event', function (data) {
      debug(data);
    });
  
    socket.on('request_handle', function(data) {
      debug('request_handle');
      var send_data = { handle: ++connection_number };
      socket.emit('handle', send_data);
      debug(send_data);
    });
  
    socket.on('i am', function (data) {
      debug(data);
      socket.broadcast.emit('hello from', { from: data.id });
    });

    socket.on('request play audio', function (data) {
      debug(data);
      var s = data.source;
      debug(s);
      if (s.endsWith('.mp3')) {
          data['content-type'] = 'audio/mp3';
	   } else if (s.endsWith('mp4')) {
          data['content-type'] = 'video/mp4';
	   } else {
          data['content-type'] = 'audio/aac';
          data['source'] = 'http://tx.sharp-stream.com/icecast.php?i=planetrock.aac'
	   }
	   socket.broadcast.emit('play audio', data );
    });
  
    socket.on('whos there', function (data) {
      debug('Whos there??');
      debug(data);
      socket.broadcast.emit('tell me your id', { from: data.id });
    });
  });

  return io;
}

