'use strict';

const _ = require('lodash');
const { Aggregate } = require('cqrs');

let Changes = {
  SET_NAME: 'set_name'
};

let eventHandlers = {};
eventHandlers[Changes.SET_NAME] = require('./events/set-name');

var Author = function() {
  var that = Aggregate({
    eventHandlers: eventHandlers
  });

  return _.merge(that, {
    setName: require('./commands/set-name')(Changes.SET_NAME)
  });
}

module.exports = Author;
