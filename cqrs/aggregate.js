'use strict';

const uuid = require('uuid/v4');
const _ = require('lodash');

const Event = require('./event');

let Actions = {
  CREATE: 'create'
};

let eventHandlers = {};
eventHandlers[Actions.CREATE] = function(data) {
  let aggregate = this;
  return aggregate.set('id', data.id).set('created', new Date(data.created));
}

var Aggregate = function(spec) {
  var spec = spec || {};
  return {
    _domainModel: {},
    _eventHandlers: _.merge(eventHandlers, spec.eventHandlers),
    _events: [],
    _unsavedEvents: [],
    create: function() {
      var event = Event(this, Actions.CREATE, { id: uuid(), type: spec.name, created: Date.now() });
      return this._addUnsavedEvent(event).applyEvent(event);
    },
    createEvent: function(type, payload) {
      this._addUnsavedEvent(Event(this, type, payload));
      return this;
    },
    _addUnsavedEvent: function(event) {
      this._unsavedEvents.push(event);
      return this;
    },
    applyEvent: function(event) {
      return this._eventHandlers[event.type].call(this, event.payload);
    },
    set: function(field, value) {
      return _.set(this, ['_domainModel', field], value);
    },
    get: function(field) {
      return _.get(this._domainModel, field);
    },
    getReadModel: function() {
      var self = this;
      _.forEach(_.sortBy(this._getEvents(), ['timestamp']), function(event) {
        return self.applyEvent(event);
      });
      return self._domainModel;
    },
    onSave: function() {
      return this
        ._setEvents(this._getEvents().concat(this.getUnsavedEvents()))
        ._clearUnsavedEvents();
    },
    getUnsavedEvents: function() {
      return this._unsavedEvents;
    },
    restore: function(events) {
      return this._setEvents(events);
    },
    _getEvents: function() {
      return _.get(this, '_events');
    },
    _setEvents: function(events) {
      return _.set(this, '_events', events);
    },
    _clearUnsavedEvents: function() {
      this._unsavedEvents = [];
      return this;
    }
  }
}

module.exports = Aggregate;
