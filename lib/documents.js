"use strict";


var docs = {};


var m1 = 
  function (doc) {
    if (doc.common.album && doc.common.artist) {
      emit( doc.common.artist, doc.common.album);
    }
  };




docs.albums =
{
   "language" : "javascript",
   "views" : {
      "artists" : {
         "map" : String(m1),
         "reduce" : "_count"
      },
      "album-artist" : {
         "reduce" : "_sum",
         "map" : "function (doc) {\n  if (doc.common.album && doc.common.artist) {\n    emit( { album: doc.common.album, artist: doc.common.artist}, 1);\n  }\n}"
      }
   },
   "_id" : "_design/albums"
};




module.exports = exports = docs;

