const { Router } = require("express");
const { add_drug } = require("../controllers/drugController");
const router = Router();

router.post("/create", add_drug);

module.exports = router;
