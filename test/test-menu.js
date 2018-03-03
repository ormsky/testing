"use strict";

var debug = require('debug')('bfr-test');
var m = require('../lib/menu.js');

exports['test menu'] = function (assert,done) {
  debug('start menu');
  var items = m.top_menu();
  assert.equal( items.length, 2 );
  console.log(items);

  items = m.get_menu("audio_options");
  console.log(items);

}


//
// if this module was run directly from the command line as in node xxx.js
// then do the test run:
//
if (module == require.main) {
  require('test').run(exports);
}
