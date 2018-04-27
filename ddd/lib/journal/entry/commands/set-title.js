'use strict';

module.exports = function(type) {
  return function(title) {
    return this.createEvent(type, { title: title });
  }
}
