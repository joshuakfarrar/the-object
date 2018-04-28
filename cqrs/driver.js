'use strict';

var Driver = function(spec) {
  var throwMissingOverrideError = function() {
    throw new Error("You didn't override something.");
  }

  return {
    fetchEventsForAggregate: spec.fetchEventsForAggregate || throwMissingOverrideError,
    saveEvents: spec.saveEvents || throwMissingOverrideError
  }
}

module.exports = Driver;