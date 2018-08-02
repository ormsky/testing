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
var db_url;
var dbdatabase;

const http = require('http');
const url = require('url');
const util = require('util');
var mm = require('music-metadata');
const fs=require('fs');

const { Readable, PassThrough, Writable } = require('stream');


exports.db = function() { return db; }

exports.connect = function (connection, database) {
  return new Promise( function(resolve, reject) {
    try {
      dbdatabase = database;
      db_url = url.parse(connection);
      dbserver = require('nano')(connection);
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
console.log('##');
    db.view('audio', 'artist_album_track', p,  function(err, doc) {
      if (err) return reject(err);

      var result = [];
      var i;
      for (i in doc.rows) {
console.log('##--->');
        console.log(i);
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
      //console.log(metadata);
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
      console.log('CONFIGURE DOCUMENT');
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
        result.items.push( { subMenu: mi._id, text: mi.menu_data.text } );
      }
      return resolve(result);
    });
  });
}



function viewx( designname, viewname, params ) {
  return new Promise( (resolve) => {
    db.view(designname, viewname, params, resolve);
  });
}


function view( designname, viewname, params ) {
    return new Promise(function(resolve,reject){
         console.log("designname");
         console.log(designname);
         console.log("viewname");
         console.log(viewname);
         console.log("params");
         console.log(params);
         console.log("--");
         db.view(designname, viewname, params, function(err,doc){
             if(err !== null) return reject(err);
             console.log(doc);
             resolve(doc);
         });
    });
}

function get( id ) {
    return new Promise(function(resolve,reject){
         db.get(id, function(err,doc){
             if(err !== null) return reject(err);
             console.log(doc);
             resolve(doc);
         });
    });
}

function getAtt( id, att ) {
    return new Promise(function(resolve,reject){
         db.attachment.get(id, att, function(err,doc){
             if(err !== null) return reject(err);
             //console.log(doc);
             resolve(doc);
         });
    });
}


exports.get_media = async function ( id ) {
  var d = await get(id);
  var a = d._attachments;
  for (var k in a) {
    console.log("KEY : "+k);
  }
  // only take the first attachment
  var key = Object.keys(a)[0];
  var data = await getAtt(id,key);

  return { contentType: a[key].Content_Type, data: data };
}

exports.get_mediaInfo = async function ( id ) {
  var d = await get(id);
  var a = d._attachments;
  for (var k in a) {
    console.log("KEY : "+k);
  }
  // only take the first attachment
  var key = Object.keys(a)[0];
  //var data = await getAtt(id,key);

  return { contentType: a[key].Content_Type };
}


function getDataStream(id, att) {
  return new Promise( (resolve, reject) => {

    var xdb = encodeURIComponent(dbdatabase);
    var xid = encodeURIComponent(id);
    var xatt = encodeURIComponent(att);
    var path = '/'+xdb+'/'+xid+'/'+xatt;

    var options = {
      protocol: db_url.protocol,
      hostname: db_url.hostname,
      port: db_url.port,
      auth: db_url.auth,
      path: path
    };

    http.get(options, function(res) {
      console.log("Got response: " + res.statusCode);
      var out = fs.createWriteStream('xxx.tmp');
      resolve(res);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        reject(e);
    });
  });
}

exports.get_mediaStream = async function ( id ) {
  var d = await get(id);
  var a = d._attachments;
  for (var k in a) {
    console.log("KEY : "+k);
  }
  // only take the first attachment
  var key = Object.keys(a)[0];
  //var data = await getAtt(id,key);

  var stream = await getDataStream( id, key );
  return stream;

//  var r = new Readable();
//  db.attachment.getAsStream(id,key).pipe(fs.createWriteStream('xxxxx333.mp3'));
  //db.attachment.getAsStream(id,key).pipe(r);
//  return r;
}


exports.get_menu = async function ( id, keys, offset, max ) {
  if (!id) { return get_menu_children( id, offset, max ); }

console.log('MENU');
console.log(id);

  var mnu = await get( id );
  console.log(mnu);
  var md = mnu.menu_data;
  var doc = await db_menu_qry( md, keys );


  var result = { id: id, items: [] };

  console.log("boo");
  //console.log(doc);
  var i;
  for (i in doc.rows) {
    console.log(i);
    var row = doc.rows[i];

    console.log(row);
    if ( md.action == "xxxxxxxstream" )
    {
      result.items.push( { id: row.id, action: "stream" } );
    }
    else
    {
      var key_values = {};
      var text;
      var k;
      for (k in md.db_keyResult) {
        console.log(k);
        var keyName = md.db_keyResult[k];
        text = row.key[k];
        key_values[keyName] = text;
      }
      // var text will contain the value of the last key
      result.items.push( { subMenu: md.subMenu, dataId: row.id, action: md.action, text: text, keys: key_values } );
    }
  }

  return result;
}




async function db_menu_qry ( menu_data, keys )
{

console.log('');
console.log('keys');
console.log(keys);
console.log(    menu_data.db_category);
console.log(    menu_data.db_view);
console.log(    menu_data.db_params);

console.log("params");
var params = "HHHHHHHHHH";
eval( "params = "+menu_data.db_params );
console.log(params);

  var doc = await view(
    menu_data.db_category,
    menu_data.db_view,
    params
  );

  return doc;

/*
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
console.log('##');
    db.view('audio', 'artist_album_track', p,  function(err, doc) {
      if (err) return reject(err);

      var result = [];
      var i;
      for (i in doc.rows) {
console.log('##--->');
        console.log(i);
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
*/
}

module.exports = exports;
