const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.welcome);

module.exports = router;