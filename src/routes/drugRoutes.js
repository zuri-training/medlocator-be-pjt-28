const { Router } = require("express");
const respondJSON = require("../controllers/responseHandler");
const { protect } = require("../controllers/authController");
const {
  add_drug,
  toogle_availability,
  delete_drug,
  get_drug,
  get_drugs_owner,
  get_drugs_users,
  search_drug,
  update_drugs,
} = require("../controllers/drugController");
const router = Router();

router.post("/create", protect, add_drug, respondJSON);
router.put("/available", protect, toogle_availability, respondJSON);
router.delete("/delete/:drug_name", protect, delete_drug, respondJSON);
router.get("/all", get_drugs_users, respondJSON);
router.get("/search/:identifier", search_drug, respondJSON);
router.get("/:drug_id", get_drug, respondJSON);
router.get("/", protect, get_drugs_owner, respondJSON);
router.put("/update/:drug_id", protect, update_drugs, respondJSON);

module.exports = router;
