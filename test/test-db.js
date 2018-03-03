"use strict";

var assert = require('assert');

var config = require('../config');

var db = require('../lib/repos_couchdb');

db.connect( config.db_url, config.db_database);

//console.log(connection);

db.configure( function (err, data) {
  console.log(err);
  assert.equal( err, null );
});






//var mm = require('music-metadata');
//const util = require('util')

//var f = process.argv[2];
//var f = '/home/sammy/Music/Wish You Were Here/Disc 1 - 1_-_Shine_On_You_Crazy_Diamond,_Parts_1-5.flac';
//var f = '/home/sammy/Music/test.flac';

/*
mm.parseFile(f, {native: true})
  .then(function (metadata) {
    //console.log(util.inspect(metadata, { showHidden: true, depth: null }));
    db.add_file( metadata, f, function(err,body) {
      console.log(err);
      console.log(body);
    });
  })
  .catch(function (err) {
    console.error(err.message);
  });

*/
