const { Router } = require("express");
const respondJSON = require("../controllers/responseHandler");
const { protect } = require("../controllers/authController");
const {
  add_drug,
  toogle_availability,
  delete_drug,
  get_drug,
  get_drugs,
  update_drugs,
} = require("../controllers/drugController");
const router = Router();

router.post("/create", add_drug, respondJSON);
router.put("/available", protect, toogle_availability, respondJSON);
router.delete("/delete/:drug_name", protect, delete_drug, respondJSON);
router.get("/:drug_name", protect, get_drug, respondJSON);
router.get("/", protect, get_drugs, respondJSON);
router.put("/update/:drug_id", protect, update_drugs, respondJSON);

module.exports = router;
