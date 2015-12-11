'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var cdnNobuild = require('./cdn-nobuild');

module.exports = (options) => {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-cdn-hoist', 'Streaming not supported'));
      return;
    }

    try {
      var src = cdnNobuild(file.contents.toString());
      file.contents = new Buffer(src);
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-cdn-hoist', err));
    }
    return cb();
  }, function() {
    this.emit('end');
  });
};
