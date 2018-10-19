// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// get the Cat model
const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  cat: {
    name: 'unknown',
    bedsOwned: 0,
  },
  dog: {
    name: 'unknown',
    breed: 'unknown',
    age: 0,
  },
};

const lastAdded = {
  cat: new Cat(defaultData.cat),
  dog: new Dog(defaultData.dog),
};

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback);
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

const getCatName = (req, res) => {
  res.json({ name: lastAdded.cat.name });
};

const setCatName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  // if required fields are good, then set name
  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  // create a new object of CatModel with the object to save
  const newCat = new Cat(catData);

  // create new save promise for the database
  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAdded.cat = newCat;
    // return success
    res.json({ name: lastAdded.cat.name, beds: lastAdded.cat.bedsOwned });
  });

  // if error, return it
  savePromise.catch(err => res.json({ err }));

  return res;
};

const searchCatName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    // if a match, send the match back
    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};

const updateLastCat = (req, res) => {
  lastAdded.cat.bedsOwned++;

  const savePromise = lastAdded.cat.save();

  savePromise.then(() => res.json({
    name: lastAdded.cat.name,
    beds: lastAdded.cat.bedsOwned,
  }));

  savePromise.catch(err => res.json({ err }));
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};

const readDog = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  Dog.findByName(name1, callback);
};

const getDogName = (req, res) => {
  res.json({ name: lastAdded.dog.name });
};

const setDogName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.age || !req.body.breed) {
    return res.status(400).json({ error: 'firstname, lastname, breed, and age are all required.' });
  }

  // if required fields are good, then set name
  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  // create a new object of DogModel with the object to save
  const newDog = new Dog(dogData);

  // create new save promise for the database
  const savePromise = newDog.save();

  savePromise.then(() => {
    lastAdded.dog = newDog;
    // return success
    res.json({ name: lastAdded.dog.name, breed: lastAdded.dog.breed, age: lastAdded.dog.age });
  });

  // if error, return it
  savePromise.catch(err => res.json({ err }));

  return res;
};

const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }

    // if a match, send the match back
    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  });
};

const updateLastDog = (req, res) => {
  lastAdded.dog.age++;

  const savePromise = lastAdded.dog.save();

  savePromise.then(() => res.json({
    name: lastAdded.dog.name,
    breed: lastAdded.dog.breed,
    age: lastAdded.dog.age,
  }));

  savePromise.catch(err => res.json({ err }));
};

const searchDogIncrementAge = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is a required field.' });
  }

  const updateCallback = (err, doc) => {
    if (err) { return res.json({ err }); }
    if (!doc) { return res.json({ error: `No dog with name \`${req.body.name}\` found.` }); }
    return res.json({
      name: doc.name,
      breed: doc.breed,
      age: doc.age,
    });
  };

  const queryCallback = (err, doc) => {
    if (err) { return res.json({ err }); }
    if (!doc) { return res.json({ error: `No dog with name \`${req.body.name}\` found.` }); }

    const dogData = {
      name: doc.name,
      breed: doc.breed,
      age: doc.age,
    };

    dogData.age++;

    return Dog.searchDogIncrementAge(req.body.name, dogData, updateCallback);
  };

  return Dog.findByName(req.body.name, queryCallback);
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }
    return res.render('page1', { cats: docs });
  };
  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it.
    }
    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readAllCats,
  readCat,
  getCatName,
  setCatName,
  searchCatName,
  updateLastCat,

  readAllDogs,
  readDog,
  getDogName,
  setDogName,
  updateLastDog,
  searchDogIncrementAge,
  searchDogName,

  notFound,
};
