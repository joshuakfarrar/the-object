
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function(table) {
    table.uuid('id');
    table.integer('timestamp');
    table.uuid('aggregateId');
    table.string('type');
    table.json('payload');
  })  
};

exports.down = function(knex, Promise) {
  
};
