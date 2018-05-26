"use strict";

/////////////////////////////////////////////////////////////////////
//
// File repository using CouchDb/nano store.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Functions written using Promises/async rather than callbacks.
//
//
//
/////////////////////////////////////////////////////////////////////

var dbserver;
var db;

const util = require('util');
var mm = require('music-metadata');

exports.db = function() { return db; }

exports.connect = function (url, database) {
  return new Promise( function(resolve, reject) {
    try {
      dbserver = require('nano')(url);
      // Ignore any errors trying to create the database!
      dbserver.db.create(database, (err,body) => {
        db = dbserver.use(database);
        resolve(db);
      });
    } catch(ex) { reject(ex); }
  });
};


exports.list_audio_artist_album_track = list_audio_artist_album_track;

function list_audio_artist_album_track ( artist, album, track ) {
  return new Promise( (resolve,reject) => {
    var p;
    if (!artist) {
      p = { reduce: true, group_level: 1};
    } else if (!album) {
      p = { startkey: [artist], endkey: [artist,{}], reduce: true, group_level: 2};
    } else if (!track) {
      p = { startkey: [artist,album], endkey: [artist,album,{}], reduce: true, group_level: 3};
    } else {
      p = { key: [artist,album,track], reduce: false};
    }

    db.view('audio', 'artist_album_track', p,  function(err, doc) {
      if (err) return reject(err);

      var result = [];
      var i;
      for (i in doc.rows) {
        var row = doc.rows[i];
        if (!artist) {
          result.push( { artist: row.key[0], count: row.value } );
        } else if (!album) {
          result.push( { artist: row.key[0], album: row.key[1], count: row.value } );
        } else if (!track) {
          result.push( { artist: row.key[0], album: row.key[1], track: row.key[2], count: row.value } );
        } else {
          result.push( row );
        }
      }
      return resolve(result);
    });
  });
}



function find_track_artists( qry ) {
  return new Promise( (resolve,reject) => {
    console.log(qry);
    db.view('tracks', 'artists', { key: qry, reduce: false },  function(err, doc) {
      if (err) return reject(err);
      return resolve(doc);
    });
  });
}


function find_track( qry ) {
  return new Promise( (resolve,reject) => {
    console.log(qry);
    db.view('tracks', 'tracks', { key: qry, reduce: false },  function(err, doc) {
      if (err) return reject(err);
      return resolve(doc);
    });
  });
}

exports.find_track = find_track;
exports.find_track_artists = find_track_artists;


function add_file_data( metadata, file, dataformat, data ) {
  return new Promise( (resolve, reject) => {
    db.insert( metadata, function(err, body) {
      if (err) {
        return reject(err);
      }

      var id = body.id;
      var rev = body.rev;
      //console.log(id);
      //console.log(rev);
      //console.log(dataformat);
      db.attachment.insert(id, file, data, 'audio/'+dataformat, { rev: rev }, function(err,body) {
        if (err) { return reject(err); }
        else { return resolve(body) };
      });
    });
  });
}


exports.add = async function add( f ) {
  var metadata = await mm.parseFile(f, {native: true});
  return await add_file( metadata, f );
}



function add_file( metadata, file ) {
  return new Promise( (resolve, reject) => {
    var dataformat = metadata.format.dataformat;
    var title = metadata.common.title;
    var artist = metadata.common.artist;
    var album = metadata.common.album;

    if (!dataformat) return reject( 'metadata does not contain format.dataformat' );
    if (!title) return reject( 'metadata does not contain title' );
    if (!artist) return reject( 'metadata does not contain artist' );


    list_audio_artist_album_track( artist, album, title ).then( (x) => {
      console.log('find track result:');
      if (!x) {
        return reject('NO RESULT!');
      }

      console.log(x);
      console.log(x.length);
      if (x.length>0) {
        return reject('Item already exists in the database.');
      }

      console.log('end find track result---');
      var fs = require('fs');
      fs.readFile(file, function(err,data) {
        if (err) {
          return reject( err );
        } else {
          return resolve( add_file_data( metadata, file, dataformat, data ) );
        }
      });

    }).catch( (err) => {
      return reject(err);
    });

  });
}



exports.configure = async function() {
  var docs = require('./documents');
  // Create array of promises for each doc value
  var pdocs = Object.values(docs).map( update_document );
  return await Promise.all( pdocs );
}


function update_document(doc) {
  return new Promise( (resolve, reject) => {
    var id = doc._id;
    db.head(id, function(err,x,header) {
      console.log(id);
      if (err && err.statusCode=='404') {
        // If error code is 404 (document not found) then create it
        create_document( id, doc ).then( () => {
          return resolve();
        });
      } else if (err) {
        return reject(err);
      } else if (header) {
        // Document exists so we want to modify it
        var rev = header.etag.replace(/"/g,'').replace(/'/g,'');
        alter_document( id, doc, rev ).then( () => {
          return resolve();
        });
      } else {
        reject('err and header undefined');
      }
    });
  });
}

function create_document(id, doc) {
  return new Promise( function(resolve, reject) {
    var doc2 = doc;
    doc2._id = id;
    db.insert( doc, id, function(err,body) {
      if (err) { console.log(err); reject(err); }
      else { resolve(body) };
    });
  });
}


function alter_document(id, doc, rev) {
  var doc2 = doc;
  doc2._rev = rev;
  return create_document( id, doc2 );
}



function get_menu_children ( parent, offset, max ) {
  return new Promise( (resolve,reject) => {
    db.view('menus', 'menus', { key: [ parent ], reduce: false, include_docs: true },  function(err, doc) {
      if (err) return reject(err);
      var result = { id: parent, items: []};
      var i;
      for (i in doc.rows) {
        var mi = doc.rows[i].doc;
        result.items.push( { id: mi._id, text: mi.menu_data.text } );
      }
      return resolve(result);
    });
  });
}


exports.get_menu = function ( id, offset, max ) {
  if (!id) { return get_menu_children( id, offset, max ); }


  return new Promise( (resolve,reject) => {
    db.get( id, (err,body) => {
      if (err) return reject(err);
      return resolve(body);
    });

//    db.view('menus', 'menus', { key: [ parent ], reduce: false, include_docs: true },  function(err, doc) {
//      if (err) return reject(err);
//      return resolve(doc);
//    });
  });
}


module.exports = exports;
