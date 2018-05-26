"use strict";

var t = require('tap');

var config = require('../config');

const temp_db = 'temp_fr_test';

var db = require('../lib/repos-couchdb');

var assert = require('assert');


t.test('test db connect', async function(t) {
  try {
    await db.connect(config.db_url, temp_db);
    //var x = await db.connect('dddwed', 'wfwfw');
    t.pass('db connect');

    var c = await db.configure();
    t.pass("db configure");
    console.log(c);

    await db.configure();
    t.pass("db re-configure");


//    var t5 = await db.add( './test/samples/sample-1.mp3' );
//    t.ok(t5.id, 'Add sample file');

    t.rejects( db.add( 'dummy' ), 'File not found' );

/*
    var u1 = await db.add('./test/samples/nb1.mp3');
    t.ok(u1.id, 'Add sample file u1');
    var u2 = await db.add('./test/samples/nb2.mp3');
    t.ok(u2.id, 'Add sample file u2');
    var u3 = await db.add('./test/samples/nb3.mp3');
    t.ok(u3.id, 'Add sample file u3');
    var u4 = await db.add('./test/samples/nb4.mp3');
    t.ok(u4.id, 'Add sample file u4');
*/

    var l1 = await db.list_audio_artist_album_track();
    console.log(l1);

    var l2 = await db.list_audio_artist_album_track( 'Nobody\'s Bizness' );
    console.log(l2);

    l2 = await db.list_audio_artist_album_track( 'Nobody\'s Bizness', 'Ao Vivo Na Capela da Misericórdia' );
    console.log(l2);

    l2 = await db.list_audio_artist_album_track( 'Nobody\'s Bizness', 'Ao Vivo Na Capela da Misericórdia', 'Come on in My Kitchen' );
    console.log(l2);


    var m = await db.get_menu(  );
    console.log( m );
    console.log( "^^^^^^^^^" );

    m = await db.get_menu( "menu_albums" );
    console.log( m );
    console.log( "^^^^^^^^^" );

//    var xx = await db.find_track( { album: 'Excavated Shellac', artist: 'James Morrison' } );
//    console.log(xx);


    t.end();

  } catch(ex) {
    t.fail(ex);
    t.end();
  }

});



