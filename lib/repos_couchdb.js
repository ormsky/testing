"use strict";


var dbserver;
var db;


exports.connect = function (url, database) {
  dbserver = require('nano')(url);
  db = dbserver.use(database);
}


function add_file_data( metadata, file, dataformat, data, callback ) {
  db.insert( metadata, function(err, body) {
    console.log(err);
    console.log(body);
    if (err) {
      return callback(err);
    }

    var id = body.id;
    var rev = body.rev;
    console.log(id);
    console.log(rev);
    console.log(dataformat);
    db.attachment.insert(id, file, data, 'audio/'+dataformat, { rev: rev }, function(err,body) {
      return callback(err,body);
    });
  });
}


exports.add_file = function( metadata, file, callback ) {
    var dataformat = metadata.format.dataformat;
    if (!dataformat) {
      return callback('metadata does not contain format.dataformat');
    }

    var fs = require('fs');
    fs.readFile(file, function(err,data) {
      if (err) {
        return callback(err);
      } else {
        return add_file_data( metadata, file, dataformat, data, callback );
      }
    });
}


exports.configure = function( callback ) {
  var docs = require('./documents');
  var d;
  for (d in docs) {
    var doc = docs[d];
    var id = doc._id;
    update_document( id, doc );
  }
}


function update_document(id, doc) {
    db.head(id, function(err,x,header) {
      console.log(id);
      if (err && err.statusCode=='404') {
        create_document( id, doc );
      } else if (header) {
        var rev = header.etag.replace(/"/g,'').replace(/'/g,'');
        console.log(header);
        alter_document( id, doc, rev );
      }
      //console.log(status.statusCode);
    });
}

function create_document(id, doc) {
  var doc2 = doc;
  doc2._id = id;
  db.insert( doc, id, function(err,body) {
    if (err) { console.log(err); }
  });
}

function alter_document(id, doc, rev) {
  var doc2 = doc;
  doc2._rev = rev;
  create_document( id, doc2 );
}



module.exports = exports;
