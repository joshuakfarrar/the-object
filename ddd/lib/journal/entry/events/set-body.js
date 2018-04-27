'use strict';

module.exports = function(data) {
  let entry = this;
  return entry.set('body', data.body);
}
