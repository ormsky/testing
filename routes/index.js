"use strict";


module.exports = function(app, repos) {

  var views = '../views/';
  var pages = views+'pages/';


  //
  // Web page routing
  //
  app.get('/', function(req, res) {
    res.render( pages+'index' );
  });

  app.get('/about', function(req, res) {
    res.render( pages+'about' );
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

