"use strict";

var t = require('tap');

var config = require('./config');

const temp_db = 'temp_fr_test';

var db = require('./lib/repos_couchdb');

var assert = require('assert');


function show(doc) {
  console.log('------------------------');
      console.log(doc);
      var i;
      for (i in doc.rows) {
        var row = doc.rows[i];
        console.log(row.key);
      }
}



t.test('test db connect', async function(t) {
  try {
    await db.connect(config.db_url, temp_db);
    t.pass('db connect');

    var c = await db.configure();
//    t.pass("db configure");
//    console.log(c);


    db.db().view( 'tracks', 'tracks', 
        { reduce: true, group_level: 1}, 
        function(err,doc) {
      show(doc);
    });


    var artist = 'James Morrison';
    db.db().view( 'tracks', 'tracks', 
        {startkey: [artist], endkey:[artist,{}], reduce: true, group_level: 2}, 
        function(err,doc) {
      show(doc);

    });


/*
    var xx = await db.find_track( { album: 'Excavated Shellac', artist: 'James Morrison' } );
    console.log(xx);

    xx = await db.find_track( { album: 'Ao Vivo Na Capela da Misericórdia' } );
    console.log(xx);

    xx = await db.find_track_artists( );
    console.log(xx);

    xx = await db.find_track_artists("Nobody's Bizness" );
    console.log(xx);
*/

//    t.end();

  } catch(ex) {
    t.fail(ex);
    t.end();
  }

});



