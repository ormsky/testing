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

/*
docs.audioMenu =
{
  "_id" : "_menu_players",
  "menu_data" : {
    "text" : "Players",
    "parent" : "",
    "items_type" : "players"
  }
}
*/

var menus =
  function (doc) {
    if (doc.menu_top) {
      emit( [ doc.id ], 1 );
    }
  }


docs.menus =
{
  "language" : "javascript",
  "views" : {
    "menus" : {
      "map" : String(menus),
      "reduce" : "_count"
    },
  },
  "_id" : "_design/menus"
};


docs.menu_albums =
{
  "_id" : "menu_albums",
  "menu_top": "true",
  "menu_data" :
  {
    "subMenu" : "menu_album_artist",
    "text" : "Albums",
    "db_category" : "audio",
    "db_view" : "artist_album_track",
    "db_params" : '{ "reduce": "true", "group_level": 1}',
    "db_keyResult" : [ "artist" ]
  }
}

/*
docs.menu_artists =
{
  "_id" : "menu_artists",
  "menu_data" :
  {
    "text" : "Artists",
//    "parent" : ""
  }
}
*/

docs.menu_album_artist =
{
  "_id" : "menu_album_artist",
  "menu_data" :
  {
    "text" : "Artists",
    "subMenu" : "menu_album_artist_album",
    "db_category" : "audio",
    "db_view" : "artist_album_track",
    "db_params" : '{ "startkey": [ keys["artist"] ], "endkey": [ keys.artist,{}], "reduce": true, "group_level": 2}',
    "db_keyResult" : [ "artist", "album" ]
  }
}


docs.menu_album_artist_album =
{
  "_id" : "menu_album_artist_album",
  "menu_data" :
  {
    "text" : "Artists",
    "action": "stream",
    "subMenu" : "menu_album_artist_album_track",
    "db_category" : "audio",
    "db_view" : "artist_album_track",
//    "db_params" : '{ "startkey": [ keys.artist, keys["album"] ], "endkey": [ keys["artist"],keys["album"],{}], "reduce": true, "group_level": 3}',
    "db_params" : '{ "startkey": [ keys.artist, keys["album"] ], "endkey": [ keys["artist"],keys["album"],{}], "reduce": false}',
    "db_keyResult" : [ "artist", "album", "track" ]
  }
}


docs.menu_album_artist_album_track =
{
  "_id" : "menu_album_artist_album_track",
  "menu_data" :
  {
    "text" : "Artists",
    "action": "stream",
    "db_category" : "audio",
    "db_view" : "artist_album_track",
    "db_params" : '{ "key": [ keys["artist"], keys["album"], keys["track"] ], "reduce": false }',
  }
}


module.exports = exports = docs;


