'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jscs = require('gulp-jscs');

const paths = {
  scripts: ['./*.js', './test/test.js']
};

gulp.task('lint', () => {
  return gulp.src(paths.scripts)
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('test', () => {
  return gulp.src('./test/**/*.js')
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch', () => {
  gulp.watch(paths.scripts, ['lint', 'test']);
});

gulp.task('default', ['lint', 'test', 'watch']);
