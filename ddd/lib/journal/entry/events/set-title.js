'use strict';

module.exports = function(data) {
  let entry = this;
  return entry.set('title', data.title);
}
