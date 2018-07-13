
var promiseDB = idb.open('test-db', 1, function(upgradeDb) { // creates 'test-db' Database
    //switch(upgradeDb.oldVersion) {
    //case 0: //no break lines with these switch statements
     var keyValStore = upgradeDb.createObjectStore('keyval'); //creates a Object Store 'keyval'
      keyValStore.put("world", "hello"); //inserts a key and value pair. 2nd argument (hello) is the key
    //case 1:
      //upgradeDb.createObjectStore('people', { keyPath: 'name' });
    //case 2:
      //var peopleStore = upgradeDb.transaction.objectStore('people');
      //peopleStore.createIndex('animal', 'favoriteAnimal');
    //case 3:
      //peopleStore = upgradeDb.transaction.objectStore('people');
      //peopleStore.createIndex('age', 'age');
  });

console.log('indexDB file reporting');
