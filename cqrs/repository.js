'use strict';

var Repository = function(driver) {
  var driver = driver || {};

  if (typeof driver.fetchEventsForAggregate !== 'function' ||
      typeof driver.saveEvents !== 'function') {
    throw new Error('Driver is incomplete.');
  }

  return {
    restore: function(aggregate, id) {
      return driver.fetchEventsForAggregate(id)
        .then(events => {
          return aggregate.restore(events);
        });
    },
    save: function(aggregate) {
      return driver.saveEvents(aggregate.getUnsavedEvents())
        .then(success => {
          return aggregate.onSave();
        });
    }
  }
}

module.exports = Repository;