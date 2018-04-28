'use strict';

const _ = require('lodash');

var Driver = function(knex) {
  return require('cqrs').Driver({
    fetchEventsForAggregate: function(id) {
      return new Promise((resolve, reject) => {
        return knex('events').where({ aggregateId: id })
          .then(events => {
            return resolve(_.each(events, function(event) {
              return _.merge(event, {
                payload: JSON.parse(event.payload)
              });
            }));
          });
      });
    },
    saveEvents: function(events) {
      return new Promise((resolve, reject) => {
        return resolve(knex('events').insert(_.each(events, function(event) {
          return _.merge(event, {
            payload: JSON.stringify(event.payload)
          });
        })));
      });
    }
  });
}

module.exports = Driver;