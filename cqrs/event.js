'use strict';

const uuid = require('uuid/v4');

var Event = function(aggregate, type, payload) {
  return {
  	id: uuid(),
  	timestamp: Date.now(),
  	aggregateId: aggregate.get('id') || payload.id,
  	type: type,
  	payload: payload
  }
}

module.exports = Event;