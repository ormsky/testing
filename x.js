"use strict";

var config = require('./config');

const temp_db = 'temp_fr_test';

var db = require('./lib/repos-couchdb');

var assert = require('assert');


async function go() {

  try {

    await db.connect(config.db_url, temp_db);
    console.log('db connect');

    await db.configure();
    console.log('db configure');

/*
    try {
      var u1 = await db.add('./test/samples/nb1.mp3');
      t.ok(u1.id, 'Add sample file u1');
    } catch (e) { console.log(e); }

    try {
      var u2 = await db.add('./test/samples/nb2.mp3');
      t.ok(u2.id, 'Add sample file u2');
    } catch (e) { console.log(e); }

    try {
      var u3 = await db.add('./test/samples/nb3.mp3');
      t.ok(u3.id, 'Add sample file u3');
    } catch (e) { console.log(e); }


    try {
      var u4 = await db.add('./test/samples/nb4.mp3');
      t.ok(u4.id, 'Add sample file u4');
    } catch (e) { console.log(e); }

    console.log('ARTISTS--------------------');
    var l1 = await db.list_audio_artist_album_track();
    console.log(l1);

    console.log('ALBUMS--------------------');
    var l2 = await db.list_audio_artist_album_track( 'Nobody\'s Bizness' );
    console.log(l2);

    console.log('TRACKS--------------------');
    l2 = await db.list_audio_artist_album_track( 'Nobody\'s Bizness', 'Ao Vivo Na Capela da Misericórdia' );
    console.log(l2);

    console.log('TRACK--------------------');
    l2 = await db.list_audio_artist_album_track( 'Nobody\'s Bizness', 'Ao Vivo Na Capela da Misericórdia', 'Come on in My Kitchen' );
    console.log(l2);
*/


    var m = await db.get_menu(  );
    console.log( m );
    console.log( "^^^^^^^^^" );

    m = await db.get_menu( "menu_albums" );
    //console.log( m );
    console.log( "^^^^^^^^^" );
    console.log( m );

console.log(m.items[0].keys);

var p1 = m.items[0].id;
var p2= m.items[0].keys;
console.log(p1);
console.log(p2);

    var m2 = await db.get_menu( p1, p2 );
    //console.log( m );
    console.log( "^^^^^^^^^" );
    console.log( m2 );

var xp1 = m2.items[0].id;
var xp2= m2.items[0].keys;
console.log(xp1);
console.log(xp2);

    var xm2 = await db.get_menu( xp1, xp2 );
    //console.log( m );
    console.log( "^^^^^^^^^" );
    console.log( xm2 );
    console.log( xm2.items[0].keys );

var zp1 = xm2.items[0].id;
var zp2= xm2.items[0].keys;
console.log(zp1);
console.log(zp2);

    var qm2 = await db.get_menu( zp1, zp2 );
    //console.log( m );
    console.log( "^^^^^^^^^" );
    console.log( qm2 );
    console.log( qm2.items[0].keys );



  } catch (e) {
    console.log(e);
  }
}

go();





