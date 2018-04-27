'use strict';

module.exports = function(type) {
  return function(body) {
    return this.createEvent(type, { body: body });
  }
}
