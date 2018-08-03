let promiseDB = idb.open('test-db', 1, function(upgradeDb) { // creates 'test-db' Database
    switch(upgradeDb.oldVersion) {
    case 0: //no break lines with these switch statements
      let ndb = upgradeDb.createObjectStore('neighborhoods', { keyPath: 'neighborhood' });
    case 1:
      let cusisines = upgradeDb.createObjectStore('cuisines');
      //peopleStore.createIndex('animal', 'favoriteAnimal');
    case 2:
      let restaurants = upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
      restaurants.createIndex('by neighborhood', 'neighborhood');
      restaurants.createIndex('by cusisine', 'cuisine_type');
    }
  });

/**
  * Write DB with key pre-set
  */
writeDatabaseKP = (database, value) => {
  promiseDB.then(function(db) {
  const tx = db.transaction(database, 'readwrite');
  const neighborhoodStore = tx.objectStore(database);
  neighborhoodStore.put(value);
  return tx.complete; //promise that fullfills if and when the transaction completes and rejects if it fails
  }).then(function(result){
    return;
    //console.log('value added');
  });
};

/**
  * Write DB with key specified
  */
writeDatabaseKey = (database, value, key) => {
  promiseDB.then(function(db) {
  const tx = db.transaction(database, 'readwrite');
  const neighborhoodStore = tx.objectStore(database);
  neighborhoodStore.put(value, key);
  return tx.complete; //promise that fullfills if and when the transaction completes and rejects if it fails
  }).then(function(result) {
    return;
    //console.log('value added');
  });
};

 /**
   * Get all information from a database
   */
readDatabase = (database) => {
  promiseDB.then(function(db) {
    const tx = db.transaction(database, 'readonly')
    const restaurantInfo = tx.objectStore(database)
    let data = restaurantInfo.getAll()
    console.log('reading DB: ', data)
  }).then(function(data) {
    return data;
  });
}
