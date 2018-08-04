/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; //Server port
    return `http://localhost:${port}/restaurants`;
  }


static fetchRestaurants() {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:1337/restaurants`,
    { method: 'GET'})
    .then(response => {
      return response.json();
    }).then(data => {
      data.forEach(location => {
        writeDatabaseKP('restaurants', location); //writes restaurants into indexedDb
      });
      console.log('fetched restaurants: ', data);
      resolve(data);
    }).catch(error => console.log(error));
  });
}

static fetchRestaurantsById(id) {
  return new Promise((resolve, reject) => {
    DBHelper.fetchRestaurants()
      .then(restaurants => {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { 
          console.log('fetched restaurants by ID: ', data);
          resolve(restaurant); // Got the restaurant
        }
      }).catch(error => {
        console.log('Unable to find restaurant with error ', error);
    });
  });
}

  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    return new Promise((resolve, reject) => {
      DBHelper.fetchRestaurants()
      .then(restaurants => {
         let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
            results = restaurants.filter(r => r.cuisine_type == cuisine);
          }
          if (neighborhood != 'all') { // filter by neighborhood
            results = restaurants.filter(r => r.neighborhood == neighborhood);
          }
          console.log('fetched restaurants by cuisine and neighborhood: ', results);
          resolve(results);
        }).catch(error => {
          console.log('Unable to find restaurants by neighborhood and cuisine ', error);
      });
    });   
  }

  static fetchRestaurantByCuisine(cuisine) {
    return new Promise((resolve, reject) => {
      DBHelper.fetchRestaurants()
      .then(restaurants => {
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        console.log('fetched restaurants by cuisine: ', result);
        resolve(results);
      }).catch(error => {
          console.log('Unable to find restaurant by cuisines with error ', error);
      });  
    });
  }

  static fetchRestaurantByNeighborhood(neighborhood) {
    return new Promise((resolve, reject) => {
      DBHelper.fetchRestaurants()
        .then(restaurants => {
          const results = restaurants.filter(r => r.neighborhood == neighborhood);
          console.log('fetched restaurants by neighborhood: ', results);
          resolve(results);
        }).catch(error => {
          console.log('Unable to find restaurants by neighborhoods with error ', error);
      });
    });
  }

  static fetchCuisines() {
    // Fetch all restaurants
    return new Promise((resolve, reject) => {
      DBHelper.fetchRestaurants()
      .then(restaurants => {
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        console.log(cuisines);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        console.log('unique cusinines: ', uniqueCuisines);
        resolve(uniqueCuisines);
        }).catch(error => {
          console.log('Unable to fetch cuisines with error ', error);
      });
    });
  }

  static fetchNeighborhoods() {
    // Fetch all restaurants
    return new Promise((resolve, reject) => {
       DBHelper.fetchRestaurants()
      .then(restaurants => {
      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
      console.log(neighborhoods);
      // Remove duplicates from neighborhoods
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
      console.log('unique neighborhoods: ', uniqueNeighborhoods);
      resolve(uniqueNeighborhoods);
    }).catch(error => {
        console.log('Unable to fetch neighborhoods with error ', error);
    });
    });
  }

  /**
   * Fetch all restaurants from server
  static fetchRestaurants(callback) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', DBHelper.DATABASE_URL);
      xhr.onload = () => {
        if (xhr.status === 200) { // Got a success response from server!
          const json = JSON.parse(xhr.responseText);
          const restaurants = json;

          json.forEach( location => {
            writeDatabaseKP('restaurants', location) ;//writes restaurants into indexedDb
          });

          callback(null, restaurants);
        } else { // Server error
          const error = (`Request failed. Returned status of ${xhr.status}`);
          callback(error, null);
        }
    };
    xhr.send();
  }


  /**
   * Fetch restaurants by a cuisine type with proper error handling.

  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  /*static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch a restaurant by its ID.

  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants(() => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  /*static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }*/

  /**
   * Fetch all neighborhoods with proper error handling.

  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  } */

  /**
   * Fetch all cuisines with proper error handling.

  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }   */

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant.photograph) {
      return (`img/${restaurant.photograph}.jpg`);
    }
    else {
      return (`img/10.jpg`);
    }

  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }
}
