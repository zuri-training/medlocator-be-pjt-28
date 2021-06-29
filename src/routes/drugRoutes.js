const { Router } = require("express");
const {
  respondJSON,
  add_drug,
  toogle_availability,
  delete_drug,
} = require("../controllers/drugController");
const router = Router();

router.post("/create", add_drug, respondJSON);
router.put("/available", toogle_availability, respondJSON);
router.delete("/delete/:drug_name", delete_drug, respondJSON);

module.exports = router;
