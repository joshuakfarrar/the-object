'use strict';

const uuid = require('uuid/v4');

let Actions = {
  CREATE: 'create'
};

let eventHandlers = {};
eventHandlers[Actions.CREATE] = function(data) {
  let aggregate = this;
  aggregate.set('id', data.id)
}

var Aggregate = function() {
  return {
    _domainModel: {},
    _eventHandlers: eventHandlers,
    create: function() {
      this.applyChange(Actions.CREATE, { id: uuid() });
    },
    applyChange: function(type, payload) {
      this._eventHandlers[type].call(this, payload);
    },
    set: function(field, value) {
      this._domainModel[field] = value;
    },
    get: function(field) {
      return this._domainModel[field];
    }
  }
}

function Event(type, payload) {
  this.type = type;
  this.payload = payload;
}

module.exports = {
  Aggregate: Aggregate,
  Event: Event
}
