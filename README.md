# gulp-cdn-hoist
> Move CDN scripts outside the useref build section

If you're using one of the many generators that use `cdnify` along with
`useref` and you're wondering why you never see any CDN links in your `dist/`
build, this package is the answer. Any `<script>` or `<link>` tags that look
like absolute URLs will be moved/hoisted above the useref `<!-- build:...>`
directive.

## Install

```shell
npm install gulp-cdn-hoist --save-dev
```

## Usage
```shell
npm install gulp gulp-load-plugins gulp-google-cdn gulp-useref gulp-cdn-hoist --save-dev
```

```js
var gulp = require('gulp');
var plugins = require('gulp-load-plugins');

gulp.src('app/index.html')
  .pipe(plugins.googleCdn(require('./bower.json')))
  .pipe(plugins.cdnHoist())
  .pipe(plugins.useref())
  .pipe(gulp.dest('dist'))
```

## License

MIT

*cdn-nobuild.js*
Copyright (c) 2014 Michal Jarosz

*All other files*
Copyright (c) 2015 David Mohr
