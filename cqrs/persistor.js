'use strict';

var storage = {};

var Persistor = function() {
	return {
		restore: function(aggregate, id) {
			var events = storage[id];
			return aggregate.restore(events);
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