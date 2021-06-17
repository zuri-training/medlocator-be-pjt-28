const { Router } = require("express");
const {
  add_drug,
  toogle_availability,
} = require("../controllers/drugController");
const router = Router();

router.post("/create", add_drug);
router.put("/available", toogle_availability);

module.exports = router;
