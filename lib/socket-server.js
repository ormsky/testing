/************************************************************************************

  Manage communication between browsers
  - enables a browser on one device to control the browser media on another device.

*************************************************************************************/

"use strict";
const connection_timeout = 300;

module.exports = createSocket;
module.exports.createSocket = createSocket;

const ROOM = 'room mediadb';

var debug=require('debug')('socket-server');
var repos;


function broadcastConnections(io) {
      var cons = {};
      for( var key in io.sockets.sockets ) {
        var alias = io.sockets.sockets[key].handshake.query.media_player_alias;
        if ( alias != null && alias !="null") {
          console.log("ALIAS-");
          console.log(alias);
          cons[key] = { id: key, name: alias };
        }
        //if ( alias ) { console.log("ALIAS"); console.log(alias); cons[key] = { handle: key, name: alias }; }
//        console.log( key );
//        console.log( alias );
      }
//      console.log("CONNECTIONS 2");

      //socket.emit('connections', publicConnections() );
//      socket.emit('connections', cons );
      io.to(ROOM).emit('connections', cons );
}





function createSocket(app, repository) {
  var io = require('socket.io')(app);
  debug('socket-server');
  repos = repository;

  io.on('connection', function (socket, options) {


//    console.log("QQQQ!!!");
//    console.log(socket.handshake.query.media_player_name);
//    console.log(socket.id);

    socket.join(ROOM, () => {
      broadcastConnections(io);
    });


    socket.on('emit', function(data) {
      io.to(ROOM).emit('emit', data);
    });

    socket.on('pauseMedia', function(data) {
      io.to(ROOM).emit('pauseMedia', data);
    });


    socket.on('requestPlayMedia', function (data) {
      debug('request play media!!!');
      io.to(ROOM).emit('playMedia', data );
    });


//    socket.on('request play audio', function (data) {
//      debug(data);
//      var s = data.source;
//      debug(s);
//      if (s.endsWith('.mp3')) {
//        data['content-type'] = 'audio/mp3';
//      } else if (s.endsWith('mp4')) {
//        data['content-type'] = 'video/mp4';
//      } else {
//        data['content-type'] = 'audio/aac';
//        data['source'] = 'http://tx.sharp-stream.com/icecast.php?i=planetrock.aac'
//      }
//      socket.broadcast.emit('play audio', data );
//    });





//    socket.on('my other event', function (data) {
//      debug(data);
//    });

//    socket.on('request_handle', function(data) {
//      debug('request_handle');
//      //var send_data = addConnection( ++connection_number, data.name, data.public );
//      var send_data = addConnection( socket.id, data.name, data.public );
//      socket.emit('handle', send_data);
//      debug(send_data);
//    });



//    socket.on('get_menu', function (data) {
//      try {
//        repos.get_menu(data).then( (result) =>
//        {
//          console.log(result);
//          socket.emit('menu', result);
//        }, (err) => { throw Error(err) }
//        );
//      } catch (err) {
//        console.log(err);
//        socket.emit('menu', { error: err });
//      }
//    });


//    socket.on('get_connections', function() {
//      expireConnections();
//      console.log("CONNECTIONS");
//      console.log( io.sockets.sockets );

//      console.log("CONNECTIONS 1");

//      var cons = {};
//      for( var key in io.sockets.sockets ) {
//        var alias = io.sockets.sockets[key].handshake.query.media_player_alias;
//        if ( alias != null && alias != "" ) { console.log("ALIAS"); console.log(alias); cons[key] = { handle: key, name: alias }; }
//        console.log( key );
//        console.log( alias );
//      }
//      console.log("CONNECTIONS 2");

      //socket.emit('connections', publicConnections() );
//      socket.emit('connections', cons );
//    });


//    socket.on('i am', function (data) {
//      debug(data);
//      socket.broadcast.emit('hello from', { from: data.id });
//    });


//    socket.on('whos there', function (data) {
//      debug('Whos there??');
//      debug(data);
//      socket.broadcast.emit('tell me your id', { from: data.id });
//    });

  });

  return io;
}




//var connection_number = 1;

//var connections = {};
//var dt = new Date();


//function addConnection(handle, name, publicPlayer) {
//  connections[handle] = { handle: handle, name: name, time: dt.getTime(), publicPlayer: publicPlayer };
//  return connections[handle];
//}

//function expireConnections() {
//  var n = dt.getTime();
//  for(var key in connections) {
//    var t = connections[key].time;
//    if (n - t > connection_timeout) {
//      debug('Connection expired');
//      delete connections[key];
//    }
//  }
//}


//function publicConnections() {
////  return connections.filter( x => x.publicPlayer == true );
//  return connections;
//}
