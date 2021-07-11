const router = require("express").Router();
const {forwardHandler, checkCoords, sortStores, findDrugStores} = require("../controllers/locationController");
const { respondJSON } = require("../controllers/responseHandler");

router.post("/", checkCoords, forwardHandler, findDrugStores, sortStores, respondJSON);

module.exports = router;