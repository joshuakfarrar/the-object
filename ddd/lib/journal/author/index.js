'use strict';

const util = require('util');
const _ = require('lodash');
const { Aggregate, Event } = require('cqrs');

let Changes = {
  SET_NAME: 'set_name'
};

let eventHandlers = {};
eventHandlers[Changes.SET_NAME] = require('./events/set-name');

var Author = function() {
  var that = Aggregate();

  return _.merge(that, {
    _eventHandlers: _.merge(that._eventHandlers, eventHandlers),

    setName: require('./commands/set-name')(Changes.SET_NAME)
  });
}

module.exports = Author;
