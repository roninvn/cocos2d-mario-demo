var util = require('util'),
    path = require('path');

var modules = ('Player').split(' ');

/** @namespace */
var entities = {};

util.each(modules, function(mod, i) {
    util.extend(entities, require('./' + mod));
});

module.exports = entities;
