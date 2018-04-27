'use strict';

module.exports = function(type) {
  return function(author) {
    return this.createEvent(type, { authorId: author.get('id') });
  }
}
