'use strict';

var Persistor = function(driver) {
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

module.exports = Persistor;