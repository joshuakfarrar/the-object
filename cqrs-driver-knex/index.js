'use strict';

const _ = require('lodash');

var prep = function(op) {
  return function(events) {
    return _.each(events, function(event) {
      return _.merge(event, {
        payload: op(event.payload)
      });
    })
  }
}

var Driver = function(knex) {
  return require('cqrs').Driver({
    fetchEventsForAggregate: function(id) {
      return new Promise((resolve, reject) => {
        return resolve(knex('events').where({ aggregateId: id }).then(prep(JSON.parse)));
      });
    },
    saveEvents: function(events) {
      return new Promise((resolve, reject) => {
        return resolve(knex('events').insert(prep(JSON.stringify)(events)));
      });
    }
  });
}

module.exports = Driver;