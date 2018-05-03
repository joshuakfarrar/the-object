'use strict';

const Repository = require('../repository');
const Aggregate = require('../aggregate');
const Driver = require('../driver');

var jestFn = jest.fn(() => {
  return new Promise((resolve, reject) => {
    return resolve([]);
  })
})

var driverSpec = {
  fetchEventsForAggregate: jestFn,
  saveEvents: jestFn
}

test('Persistor must be passed a valid driver', () => {
  expect(Repository).toThrow('Driver is incomplete.')
});

test('restore must used the driver\'s fetchEventsForAggregate method to restore an aggregate', () => {
  var driver = Driver(driverSpec);

  var repository = Repository(driver);

  repository.restore(Aggregate(), 'test');
  expect(driverSpec.fetchEventsForAggregate).toHaveBeenCalled();
});

test('save must used the driver\'s saveEvents method to restore an aggregate', () => {
  var driver = Driver(driverSpec);

  var repository = Repository(driver);

  repository.save(Aggregate());
  expect(driverSpec.saveEvents).toHaveBeenCalled();
});