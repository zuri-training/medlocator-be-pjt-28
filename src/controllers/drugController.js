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

const toogle_availability = async (req, res) => {
  try {
    const { new_data } = req.body;
    const drug = await Drug.findOne({
      name: new_data.name,
      store: req.body.store,
    });
    if (!drug) throw new Error(`No drug named ${new_data.name} exists.`);
    drug.available = new_data.available;
    await drug.save();
    res.status(200).send({
      status: "success",
      message: `The drug's availability status has successfully been changed to ${new_data.available}.`,
      body: {},
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
  toogle_availability,
};
