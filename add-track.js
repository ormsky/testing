"use strict";

//console.log( process.argv );


var config = require('./config');

var db = require('./lib/repos-couchdb');

db.connect( config.db_url, config.db_database);


var mm = require('music-metadata');
const util = require('util')

var files = process.argv.slice(2);

//console.log( f );

var x;
for (x in files) {
  var z = files[x];
  console.log(z);
  db.add(z);
}


function add( f ) {
  mm.parseFile(f, {native: true})
    .then(function (metadata) {
      //console.log(util.inspect(metadata, { showHidden: true, depth: null }));
      db.add_file( metadata, f, function(err,body) {
        if (err) { console.log(err); }
      });
    })
    .catch(function (err) {
      console.error(err.message);
    });
}



/*
mm.parseFile(f, {native: true})
  .then(function (metadata) {
    console.log(f);
    console.log(util.inspect(metadata, { showHidden: true, depth: null }));
  })
  .catch(function (err) {
    console.error(err.message);
  });

*/
