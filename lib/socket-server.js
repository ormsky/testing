"use strict";
const connection_timeout = 300;

module.exports = createSocket;
module.exports.createSocket = createSocket;


var connection_number = 1;
var debug=require('debug')('socket-server');

var connections = {};
var dt = new Date();

var repos;

function addConnection(handle, name) {
  connections[handle] = { handle: handle, name: name, time: dt.getTime() };
  return connections[handle];
}

function expireConnections() {
  var n = dt.getTime();
  for(var key in connections) {
    var t = connections[key].time;
    if (n - t > connection_timeout) {
      debug('Connection expired');
      delete connections[key];
    }
  }
}


function createSocket(app, repository) {
  var io = require('socket.io')(app);
  debug('socket-server');
  repos = repository;

  io.on('connection', function (socket) {

    socket.on('my other event', function (data) {
      debug(data);
    });

    socket.on('request_handle', function(data) {
      debug('request_handle');
      var send_data = addConnection( ++connection_number, data.name );
      socket.emit('handle', send_data);
      debug(send_data);
    });


    socket.on('get_menu', function (data) {
      try {
        repos.get_menu(data).then( (result) => 
        {
          console.log(result);
          socket.emit('menu', result);
        }, (err) => { throw Error(err) }
        );
      } catch (err) {
        console.log(err);
        socket.emit('menu', { error: err });
      }
    });

    socket.on('get_connections', function() {
      expireConnections();
      debug(connections);
      debug(Object.keys(connections).length);
      socket.emit('connections', connections);
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

