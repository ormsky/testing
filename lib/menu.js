"use strict";
var exports = module.exports = {};




var menu_item = {
  player: { text: "Player", target: "players" },
  audio: { text: "Music", target: "audio_options" },
  albums: { text: "Albums", target: "album_options" },
  songs: { text: "Songs", target: "song_options" },
};


////////////////////////////////////////////////////////////////////////
//
//  Menu Types:
//    menu_items    - Object contains an array of menu items
//    players       - Return a list of registered players
//    query         - Return results of the query specified
//
////////////////////////////////////////////////////////////////////////
var menu = {
  players: { type: "players" },
  audio_options: { type: "menu_items", items: [ menu_item.albums, menu_item.songs ] },
  album_options: { type: "menu_items", items: [ menu_item.albums, menu_item.songs ] },
  albums_artists: { type: "query", view: "xxxx", value: "artist_id", target: "album_tracks" },
  top: { type: "menu_items", items: [ menu_item.player, menu_item.audio ] },
};


////////////////////////////////////////////////////////////////////
//
// target - the name of the menu
// params - array of parameter values, such as:
//            artist_id
//            max_items
//            start_item
//
////////////////////////////////////////////////////////////////////
exports.get_menu = function (target, params) {
  var m = menu[target];
  switch (m.type) {
    case "players":

      break;
    case "menu_items":
      return m.items;
  }
}

exports.top_menu = function () {
  return exports.get_menu("top");
}


/*
var m_album_songs = { type: "query", view: "album_songs", parameters: [ "album_id" ], value: "song_id" };
var m_albums =  { type: "query", view: "albums", value: "album_id", items: [ m_album_songs ] };
var m_albums_for_artist =  { type: "query", view: "albums_for_artist", parameters: [ "artist_id" ], value: "album_id", items: [ m_album_songs ] };
var m_album_artists = { type: "query", view: "album_artists", value: "artist_id", items: [ m_albums_for_artist ] };


var m_songs =  { type: "query", view: "songs", value: "song_id" };
var m_songs_for_artist =  { type: "query", view: "songs_for_artist", parameters: [ "artist_id" ], value: "song_id" };
var m_song_artists = { type: "query", view: "song_artists", value: "artist_id", items: [ m_songs_for_artist ] };


var m_audio = { text: "Audio", type: "menuoption", items: [
    {
      text: "Albums",
      type: "menuoption",
      items: [
        { text: "By Artist", type: "menuoption", items: [ m_album_artists ] },
        { text: "By Name", type: "menuoption", items: [ m_albums ] },
      ]
    },
    {
      text: "Play Lists",
      type: "menuoption",
      items: [  ]
    },
    {
      text: "Songs",
      type: "menuoption",
      items: [
        { text: "By Artist", type: "menuoption", items: [ m_song_artists ] },
        { text: "By Name", type: "menuoption", items: [ m_songs ] },
      ]
    }
  ]
};



*/


