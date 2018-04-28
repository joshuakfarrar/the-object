const { Persistor } = require('cqrs');
const Driver = require('cqrs-driver-knex');
const { Journal } = require('./index');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./dev.sqlite3"
  }
});

var persistor = Persistor(Driver(knex));

var entry = Journal.Entry();
entry.create();
entry.setTitle('hello world.');
entry.setBody('we\'re doing it live #maga');
entry.setTitle('just hello');

var author = Journal.Author();
author.create();
author.setName('Joshua K. Farrar');

entry.addAuthor(author);
entry.addAuthor(author);
entry.removeAuthor(author);
entry.addAuthor(author);
entry.addAuthor(author);
entry.addAuthor(author);
entry.addAuthor(author);

entry
  .setTitle('the')
  .setTitle('conquest')
  .setTitle('of')
  .setTitle('bread')
  .setTitle('the conquest of bread');

console.log("Entry");
console.log("-----")
console.log(entry._domainModel);

console.log();
console.log("Author");
console.log("------")
console.log(author._domainModel);

persistor.save(entry)
  .then(aggregate => {

    // console.log("Entry");
    // console.log("-----")
    // console.log(aggregate.getReadModel());

    // persistor.save(author);

    persistor.restore(Journal.Entry(), entry.get('id'))
      .then(restored => {
        console.log();
        console.log("Entry: Restored");
        console.log("---------------");
        console.log(restored.getReadModel());

        knex.destroy();
      });
  });