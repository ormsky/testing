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


