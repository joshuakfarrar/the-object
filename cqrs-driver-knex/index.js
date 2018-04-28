'use strict';

const _ = require('lodash');

var Driver = function(knex) {
  var that = require('cqrs').Driver;
  return that({
    fetchEventsForAggregate: function(id) {
      return new Promise((resolve, reject) => {
        return knex('events').where({ aggregateId: id })
          .then(events => {
            return resolve(_.each(events, function(event) {
              var e = event;
              e.payload = JSON.parse(event.payload);
              return e;
            }));
          });
      });
    },
    saveEvents: function(events) {
      return new Promise((resolve, reject) => {
        return resolve(knex('events').insert(_.each(events, function(event) {
          var e = event;
          e.payload = JSON.stringify(event.payload);
          return e;
        })));
      });
    }
  });
}

module.exports = Driver;