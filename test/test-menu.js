"use strict";

var debug = require('debug')('bfr-test');
var m = require('../lib/menu.js');

var tap = require('tap');


var items = m.top_menu();
tap.equal( items.length, 2 );
console.log(items);

items = m.get_menu("audio_options");
tap.equal( items.length, 2 );
console.log(items);

