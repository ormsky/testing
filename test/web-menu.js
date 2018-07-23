//"use strict";

var debug = require('debug')('bfr-test');
//var m = require('../public/javascript/menus.js');

var fs = require('fs');

eval(fs.readFileSync('public/javascript/menus.js').toString());

var tap = require('tap');

var data = [ 
  { id:"123", text:"Blah" },
  { id:"xx123", text:"xx Blah" },
 ];
var items = createMenu_li(data);

console.log(items);

tap.equal( items.length, 2 );
