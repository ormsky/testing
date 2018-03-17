"use strict";

/////////////////////////////////////////////////////////
//
// CouchDB Design Documents
//
/////////////////////////////////////////////////////////

var docs = {};

// CouchDB mapping function:
var albums_map_artists =
  function (doc) {
    if (doc.common.album && doc.common.artist) {
      emit( doc.common.artist, doc.common.album );
    }
  };

var albums_map_album_artist =
  function (doc) {
    if (doc.common.album && doc.common.artist) {
      emit( { album: doc.common.album, artist: doc.common.artist}, 1);
    }
  }


docs.albums =
{
   "language" : "javascript",
   "views" : {
      "artists" : {
         "map" : String(albums_map_artists),
//         "reduce" : "_count"
      },
      "album-artist" : {
         "map" : String(albums_map_album_artist),
//         "reduce" : "_sum",
      }
   },
   "_id" : "_design/albums"
};

var audio_artist_album_track =
  function (doc) {
    if (doc.common.title) {
      emit( [  doc.common.artist, doc.common.album, doc.common.title ], 1 );
    }
  }


docs.audio =
{
  "language" : "javascript",
  "views" : {
    "artist_album_track" : {
      "map" : String(audio_artist_album_track),
      "reduce" : "_count"
    },
  },
  "_id" : "_design/audio"
};




module.exports = exports = docs;

