'use strict';

module.exports = function(type) {
  return function(name) {
    return this.createEvent(type, { name: name });
  }
}
