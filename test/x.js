var config = require('../config.js');

var tap = require('tap');

tap.pass('this is fine');

tap.true(config.test_db_name);
