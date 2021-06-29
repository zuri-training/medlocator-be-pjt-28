const Store = require('../models/Store');

exports.getStores = async (req, res, next) => {
  try {
    const store = await Store.find().sort('name');
    res.send(store);
  } catch (err) {
    next(err);
  }
};


exports.updateStore = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.send(store);
  } catch (err) {
    next(err);
  }
};

exports.deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndRemove(req.params.id);

    if (!store)
      return res.status('404').send('the store with the id could not be found');

    res.send(store);
  } catch (err) {
    next(err);
  }
};

exports.getOneStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store)
      return res.status('404').send('the store with the id could not be found');
    res.send(store);
  } catch (err) {
    next(err);
  }
};
