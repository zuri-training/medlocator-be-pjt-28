const {protect} = require('../controllers/authController');
const router = require('express').Router();
const {
  getOneStore,
  updateStore,
  deleteStore,
  getStores,
} = require('../controllers/storeController');

router.get('/getOneStores',protect, getOneStore),
  router.put('/updateStore',protect, updateStore),
  router.delete('/deleteStore',protect, deleteStore),
  router.get('/getStores', getStores);

module.exports = router;
