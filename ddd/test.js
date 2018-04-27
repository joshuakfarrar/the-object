const { Persistor } = require('cqrs');

const { Journal } = require('./index');

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
  .setTitle('the conquest of bread')

console.log("Entry");
console.log("-----")
console.log(entry._domainModel);
console.log();
console.log("Author");
console.log("------")
console.log(author._domainModel);

Persistor().save(entry);

Persistor().save(author);

var restored = Persistor().restore(Journal.Entry(), entry.get('id'));

console.log();
console.log("Entry: Restored");
console.log("---------------")
console.log(restored.getReadModel());