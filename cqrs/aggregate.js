'use strict';

const uuid = require('uuid/v4');
const _ = require('lodash');

const Event = require('./event');

let Actions = {
  CREATE: 'create'
};

let eventHandlers = {};
eventHandlers[Actions.CREATE] = function(data) {
  return this.set('id', data.id).set('created', new Date(data.created));
}

var Aggregate = function(spec) {
  var spec = spec || {};
  return {
    _domainModel: {},
    _eventHandlers: _.merge(eventHandlers, spec.eventHandlers),
    _events: [],
    _unsavedEvents: [],
    create: function() {
      if (typeof this.get('id') !== 'undefined') {
        throw new Error('Aggregate has already been created.');
      }
      var event = Event(this, Actions.CREATE, { id: uuid(), type: spec.name, created: Date.now() });
      return this._addUnsavedEvent(event)._applyEvent(event);
    },
    createEvent: function(type, payload) {
      if (typeof this.get('id') === 'undefined') {
        throw new Error('Aggregate has not yet been created.');
      }
      this._addUnsavedEvent(Event(this, type, payload));
      return this;
    },
    _addUnsavedEvent: function(event) {
      this._unsavedEvents.push(event);
      return this;
    },
    _applyEvent: function(event) {
      return this._eventHandlers[event.type].call(this, event.payload);
    },
    set: function(field, value) {
      return _.set(this, ['_domainModel', field], value);
    },
    get: function(field) {
      return _.get(this._domainModel, field);
    },
    applyEvents: function() {
      var self = this;
      _.forEach(_.sortBy(this.getUnsavedEvents().concat(this._getEvents()), ['timestamp']), function(event) {
        return self._applyEvent(event);
      });
      return self;
    },
    getReadModel: function() {
      return this.applyEvents()._domainModel;
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
      if (typeof this.get('id') !== 'undefined') {
        throw new Error('An Aggregate cannot be restored onto if it has already been created.');
      }
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