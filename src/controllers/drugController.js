const Drug = require("../models/Drug");

const respondJSON = (req, res) => {
  const { status, code, message, body } = req.api_res;
  const res_data = {
    status,
    code,
    message,
    body,
  };
  res.status(code).json(res_data);
};

const add_drug = async (req, res, next) => {
  try {
    const { drug_info } = req.body;
    const drug_saved = await Drug.findOne({
      name: drug_info.name,
      store: req.store.id,
    });
    if (drug_saved)
      throw new Error(
        `The drug ${drug_info.name} has been added by you previously`
      );
    const new_drug = new Drug({
      ...drug_info,
      available: true,
      store: req.store.id,
    });
    const drug = await new_drug.save();

    req.api_res = {
      status: "success",
      code: 201,
      message: "Drug entry was successful.",
      body: { drug },
    };
    next();
  } catch (e) {
    res.status(409).send({
      status: "failure",
      code: 409,
      message: e.message,
      body: {},
    });
  }
};

const toogle_availability = async (req, res, next) => {
  try {
    const { new_data } = req.body;
    const drug = await Drug.findOne({
      name: new_data.name,
      store: req.store.id,
    });
    if (!drug) throw new Error(`No drug named ${new_data.name} exists.`);
    drug.available = new_data.available;
    await drug.save();

    req.api_res = {
      status: "success",
      code: 200,
      message: `The drug's availability status has successfully been changed to ${new_data.available}.`,
      body: {},
    };
    next();
  } catch (e) {
    res.status(409).send({
      status: "failure",
      code: 409,
      message: e.message,
      body: {},
    });
  }
};

const delete_drug = async (req, res, next) => {
  try {
    const { drug_name } = req.params;
    const drug = await Drug.findOneAndDelete({
      name: drug_name,
      store: req.store.id,
    });
    if (!drug) throw new Error(`The drug ${drug_name} does not exist.`);

    req.api_res = {
      status: "success",
      code: 200,
      message: `The drug ${drug_name} has been sucessfully deleted.`,
      body: {},
    };
    next();
  } catch (e) {
    res.status(409).send({
      status: "failure",
      code: 409,
      message: e.message,
      body: {},
    });
  }
};

module.exports = {
  respondJSON,
  add_drug,
  toogle_availability,
  delete_drug,
};
