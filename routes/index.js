"use strict";


module.exports = function(app, repos) {

  var views = '../views/';
  var pages = views+'pages/';


  //
  // Web page routing
  //
  app.get('/', function(req, res) {
    var q = req.query;
    var id = q.id;
    var publicPlayer = ( q.publicPlayer === undefined ) ? false : q.publicPlayer;
    res.render( pages+'index', { publicPlayer: publicPlayer } );
  });

  app.get('/about', function(req, res) {
    res.render( pages+'about' );
  });


  //
  // Media request routing
  //
  app.get('/media', function(req, res) {
    var q = req.query;
    var id = q.id;
    var publicPlayer = ( q.publicPlayer === undefined ) ? false : q.publicPlayer;
    repos.get_media( id )
      .then( function (data) {
         res.set('Content-Type', data.contentType);

         //res.send( data.data );
        repos.get_mediaStream( id )
        .then( function(stream) {
          stream.pipe(res);
        })
        .catch( function(error) {
          console.log(error);
          res.sendStatus(500);
        });
      })
      .catch( function(error) {
        console.log(error);
        res.sendStatus(500);
      });
  });


  //
  // Menu request routing
  //
  app.get('/menu.json', function(req, res) {
    var q = req.query;
    var id = q.id;
console.log("keys");
console.log(q.keys);
    var keys;
    if (q.keys) { keys = JSON.parse( q.keys ); }
    var offset = q.offset;
    var max = q.max;
    repos.get_menu( id, keys, offset, max )
      .then( function (fulfilled) {
         res.send( fulfilled );
      })
      .catch( function(error) {
        console.log(error);
        res.sendStatus(500);
      });
  });

};

