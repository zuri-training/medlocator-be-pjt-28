const router = require('express').Router();
const {
  getOneStore,
  updateStore,
  createStores,
  deleteStore,
  getStores,
} = require('../controllers/storeController');

router.get('/getOneStores', getOneStore),
  router.put('/updateStore', updateStore),
  router.post('/createStores', createStores),
  router.delete('/deleteStore', deleteStore),
  router.get('getStores', getStores);

module.exports = router;
