'use strict';

const _ = require('lodash');
const { Aggregate } = require('cqrs');

let Changes = {
  SET_NAME: 'set_name'
};

let eventHandlers = {};
eventHandlers[Changes.SET_NAME] = require('./events/set-name');

let commands = {
  setName: require('./commands/set-name')(Changes.SET_NAME)
}

var Author = function() {
  var that = Aggregate({
    name: 'author',
    eventHandlers: eventHandlers
  });

  return _.merge(that, commands);
}

module.exports = Author;
