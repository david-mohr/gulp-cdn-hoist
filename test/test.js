'use strict';

var should = require('should');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var googleCdn = require('gulp-google-cdn');
var useref = require('gulp-useref');
var cdnHoist = require('../index');
var gulp = require('gulp');

function gulpFile(filePath) {
  return new gutil.File({
    path:     filePath,
    cwd:      __dirname,
    base:     path.dirname(filePath),
    contents: fs.readFileSync(filePath)
  });
}

describe('hoist CDN', () => {
  it('should hoist absolute URLs', (done) => {
    var testFile = gulpFile('test/hoist.html');

    var stream = cdnHoist();

    stream.on('data', (htmlFile) => {
      should.exist(htmlFile.contents);
      htmlFile.contents.toString()
        .should.equal(fs.readFileSync('test/hoist.expected.html').toString());
    });

    stream.once('end', done);

    stream.write(testFile);
    stream.end();
  });

  it('should work with gulp-google-cdn and gulp-useref', function(done) {
    this.timeout(10000);

    var through = require('through2');
    var jsContent = fs.readFileSync('test/local.js').toString();
    var bowerContent = fs.readFileSync('test/bower.expected.html').toString();

    gulp.src('test/bower.html')
      .pipe(googleCdn(require('./bower.json')))
      .pipe(cdnHoist())
      .pipe(useref())
      .pipe(through.obj(function(assetFile, enc, callback) {
        should.exist(assetFile.contents);
        switch (assetFile.relative) {
          case 'bower.html':
            assetFile.contents.toString().should.equal(bowerContent);
            break;
          case 'vendor.js':
            assetFile.contents.toString().should.equal(jsContent);
            break;
          case 'app.js':
            assetFile.contents.toString().should.equal(jsContent);
            break;
          default:
            should.not.exist(assetFile.relative);
        }
        callback();
      }, () => done()
      ));
  });
});
