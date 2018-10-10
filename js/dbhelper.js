/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Server URL
   */
  static get DATABASE_URL() {
    const port = 1337; //Server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Get restaurant data
   * If there is data in indexedDB, read it from there first
   * If there is no information stored in indexedDB, call server for data
   */
  static fetchRestaurants() {
    return new Promise((resolve, reject) => {
      //if the database is populated, read from the database
      countDatabase('restaurants')
      .then(result => {
        if (result > 0) {
          readDatabase('restaurants')
          .then(results => {
             resolve(results);
           });
         
        //if the database is empty, request data from server
        } else {
          fetch(`${DBHelper.DATABASE_URL}`,
          { method: 'GET'})
          .then(response => {
            return response.json();
          }).then(data => {
            console.log(data);
            data.forEach(location => {
              writeDatabaseKP('restaurants', location); //writes restaurants into indexedDb
            });
            resolve(data);
          }).catch(error => console.log(error));
        }
      });
    });
  }

  /**
   * Get restaurants by ID
   */
  static fetchRestaurantById(id) {
    return new Promise((resolve, reject) => {
      DBHelper.fetchRestaurants()
        .then(restaurants => {
          const restaurant = restaurants.find(r => r.id == id);
          resolve(restaurant); // Got the restaurant
        }).catch(error => {
          console.log('Unable to find restaurant by ID with error ', error);
      });
    });
  }

  /**
   * Get restaurants by cuisine and neighborhood
   */
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
          resolve(results);
        }).catch(error => {
          console.log('Unable to find restaurants by neighborhood and cuisine ', error);
      });
    });   
  }

  /**
   * Get restaurants by cuisine
   */
  static fetchRestaurantByCuisine(cuisine) {
    return new Promise((resolve, reject) => {
      DBHelper.fetchRestaurants()
      .then(restaurants => {
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        resolve(results);
      }).catch(error => {
          console.log('Unable to find restaurant by cuisines with error ', error);
      });  
    });
  }

  /**
   * Get restaurants by neighborhood
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    return new Promise((resolve, reject) => {
      DBHelper.fetchRestaurants()
        .then(restaurants => {
          const results = restaurants.filter(r => r.neighborhood == neighborhood);
          resolve(results);
        }).catch(error => {
          console.log('Unable to find restaurants by neighborhoods with error ', error);
      });
    });
  }

  /**
   * Get cuisines
   */
  static fetchCuisines() {
    // Fetch all restaurants
    return new Promise((resolve, reject) => {
      DBHelper.fetchRestaurants()
      .then(restaurants => {
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        resolve(uniqueCuisines);
        }).catch(error => {
          console.log('Unable to fetch cuisines with error ', error);
      });
    });
  }

  /**
   * Get neighborhoods
   */
  static fetchNeighborhoods() {
    // Fetch all restaurants
    return new Promise((resolve, reject) => {
       DBHelper.fetchRestaurants()
      .then(restaurants => {
      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
      // Remove duplicates from neighborhoods
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
      resolve(uniqueNeighborhoods);
    }).catch(error => {
        console.log('Unable to fetch neighborhoods with error ', error);
    });
    });
  }

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
   * Restaurant image URL.
   */
   static updateFavStatus(id, status) {
    console.log('favorite status changed to:', status);

    fetch(`${DATABASE_URL}${id}/?isfavorite=${status}`, {
      method: 'PUT'
    })
    .then((response) => {
      console.log(response);
    });
    //TODO: Update indexDB restaurant favorite status
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
