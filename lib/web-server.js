"use strict";


module.exports = listen;
module.exports.listen = listen;


var path = require('path');

function listen(port, repos) {

  var express = require('express');
  var routes = require('../routes/index.js');
  var app = express();


  app.set('view engine', 'ejs');

  console.log(process.cwd());
  console.log(__dirname);


  app.use('/public', express.static(process.cwd() + '/public'));
//  app.use('/public/javascript/socket.io', express.static(path.join(process.cwd(), 'node_modules/socket.io/lib')));
  app.use('/public/javascript/socket.io', express.static(path.join(process.cwd(), 'node_modules/socket.io-client/dist')));

  app.use('/public/bootstrap', express.static(path.join(process.cwd(), 'node_modules/bootstrap/dist')));
  app.use('/public/jquery', express.static(path.join(process.cwd(), 'node_modules/jquery/dist')));
  app.use('/public/slick', express.static(path.join(process.cwd(), 'node_modules/slick-carousel/slick')));
  app.use('/public/popper', express.static(path.join(process.cwd(), 'node_modules/popper.js/dist')));



  routes(app, repos);


  app.listen(port, function() {
    console.log('Server listening on port ' + port + '…');
  });

  return app;

}

