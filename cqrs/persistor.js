'use strict';

var storage = {};

var Persistor = function(driver) {
	return {
		restore: function(aggregate, id) {
			return driver.fetchEventsForAggregate(id)
			  .then(events => {
			    return aggregate.restore(events);
			  });
		},
		save: function(aggregate) {
			// console.log("\nEvents\n------")
			// console.log(aggregate.getUnsavedEvents());

			storage[aggregate.get('id')] = aggregate.getUnsavedEvents();
			aggregate.onSave();

			return false;
		}
	}
}

module.exports = Persistor;