const Drug = require("../models/Drug");

const add_drug = async (req, res) => {
  try {
    const { drug_info } = req.body;
    const new_drug = new Drug(drug_info);
    const drug = await new_drug.save();
    res.status(201).send({
      status: "success",
      message: "Drug entry was successful.",
      body: { drug },
    });
  } catch (e) {
    res.status(409).send({
      status: "failure",
      message: e.message,
      body: {},
    });
  }
};

module.exports = {
  add_drug,
};
