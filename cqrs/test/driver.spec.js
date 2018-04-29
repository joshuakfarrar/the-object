'use strict';

const Driver = require('../Driver');

test('Driver should throw Errors if the driver methods are not overridden', () => {
  var driver = Driver();

  expect(driver.fetchEventsForAggregate).toThrow('Your driver did not override a driver method.');
  expect(driver.saveEvents).toThrow('Your driver did not override a driver method.');
});

test('fetchEventsForAggregate should be overridden when passed in.', () => {
  var handler = function() {};

  var driver = Driver({
    fetchEventsForAggregate: handler
  });

  expect(driver.fetchEventsForAggregate).not.toThrow();
});

test('saveEvents should be overridden when passed in.', () => {
  var handler = function() {};

  var driver = Driver({
    saveEvents: handler
  });

  expect(driver.saveEvents).not.toThrow();
});