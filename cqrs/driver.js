'use strict';

var Driver = function(spec) {
  var spec = spec || {};

  var throwMissingOverrideError = function() {
    throw new Error('Your driver did not override a driver method.');
  }

  return {
    fetchEventsForAggregate: spec.fetchEventsForAggregate || throwMissingOverrideError,
    saveEvents: spec.saveEvents || throwMissingOverrideError
  }
}

module.exports = Driver;