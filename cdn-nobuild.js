/**
 * Copyright (c) 2014 Michal Jarosz
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

module.exports = function(src) {
  var cdnTagsRe = /(<script\ssrc\s*=\s*['"](?:[a-zA-Z]+?:)?\/\/[^<]+<\/script>)|(<link(?:\s+\w*=['"].*?['"])*?\s+href\s*=\s*['"](?:[a-zA-Z]+:)?\/\/[^<>]+?\/?>)/gim;
  var buildSectionBeginRe = /<!--\s*build:/gim;
  var buildSectionEndRe = /<!--\s*endbuild/gim;

  var beginMatch, endMatch, buildSection;

  var sectionsData = [];

  buildSectionBeginRe.lastIndex = 0;
  buildSectionEndRe.lastIndex = 0;
  while (beginMatch = buildSectionBeginRe.exec(src)) {
    endMatch = buildSectionEndRe.exec(src);

    if (!endMatch) {
      cb(new gutil.PluginError(
        'gulp-cdn-hoist',
        'Missing endbuild block!')
      );
      return;
    }

    buildSection = src.substring(beginMatch.index, endMatch.index);
    var cdnScriptTags = [];
    var cdnMatch;
    while (cdnMatch = cdnTagsRe.exec(buildSection)) {
      cdnScriptTags.push(cdnMatch[0]);
    }
    var newBuildSection = buildSection.replace(cdnTagsRe, '');
    newBuildSection = cdnScriptTags.join('\n') + '\n' + newBuildSection;

    sectionsData.push({
      begin: beginMatch.index,
      end: endMatch.index,
      newBuildSection: newBuildSection
    });
  }

  for (var i = sectionsData.length - 1; i >= 0; i--) {
    var section = sectionsData[i];
    src = src.substring(0, section.begin) +
        section.newBuildSection +
        src.substring(section.end);
  }

  return src;
};
