const controllers = require('./controllers');

const router = (app) => {
    // src
  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', controllers.page3);
  app.get('/page4', controllers.page4);

    // get
  app.get('/getCatName', controllers.getCatName);
  app.get('/findCatByName', controllers.searchCatName);
  app.get('/getDogName', controllers.getDogName);
  app.get('/findDogByName', controllers.searchDogName);

    // index
  app.get('/', controllers.index);
  app.get('/*', controllers.notFound);

    // post
  app.post('/setCatName', controllers.setCatName);
  app.post('/updateLastCat', controllers.updateLastCat);
  app.post('/setDogName', controllers.setDogName);
  app.post('/updateAge', controllers.searchDogIncrementAge);
};

// export the router function
module.exports = router;
