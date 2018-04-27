'use strict';

const { Aggregate } = require('cqrs');
const _ = require('lodash');

let Changes = {
  SET_TITLE: 'set_title',
  SET_BODY: 'set_body',
  ADD_AUTHOR: 'add_author',
  REMOVE_AUTHOR: 'remove_author'
};

let eventHandlers = {};
eventHandlers[Changes.SET_TITLE] = require('./events/set-title');
eventHandlers[Changes.SET_BODY] = require('./events/set-body');
eventHandlers[Changes.ADD_AUTHOR] = require('./events/add-author');
eventHandlers[Changes.REMOVE_AUTHOR] = require('./events/remove-author');

var Entry = function() {
  var that = Aggregate({
    eventHandlers: eventHandlers
  });

  // commands
  return _.merge(that, {
    setTitle: require('./commands/set-title')(Changes.SET_TITLE),
    setBody: require('./commands/set-body')(Changes.SET_BODY),
    addAuthor: require('./commands/add-author')(Changes.ADD_AUTHOR),
    removeAuthor: require('./commands/remove-author')(Changes.REMOVE_AUTHOR)
  });
}

module.exports = Entry;
