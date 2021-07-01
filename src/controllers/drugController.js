const Drug = require("../models/Drug");

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
    next(e)
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
    next(e);
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
    next(e);
  }
};

const get_drug = async (req, res, next) => {
  try {
    const { drug_name } = req.params;
    const drug = await Drug.findOne({
      name: drug_name,
      store: req.store.id,
    });
    if (!drug) throw new Error(`The drug ${drug_name} does not exist.`);

    req.api_res = {
      status: "success",
      code: 200,
      message: `The drug ${drug_name} has been sucessfully found and returned.`,
      body: {
        drug,
      },
    };
    next();
  } catch (e) {
    next(e);
  }
};

/* for store owner to get all drugs whether 
available or not
*/
const get_drugs_owner = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const start_from = (page - 1) * limit;
    const results = await Drug.find().limit(parseInt(limit)).skip(start_from);

    req.api_res = {
      status: "success",
      code: 200,
      message: `The drugs have been sucessfully found and returned.`,
      body: {
        results,
      },
    };
    next();
  } catch (e) {
    next(e);
  }
};

const update_drugs = async (req, res, next) => {
  try {
    const { updated_data } = req.body;
    const { drug_id } = req.params;
    await Drug.findByIdAndUpdate(drug_id, updated_data);
    const drug = await Drug.findById(drug_id);

    req.api_res = {
      status: "success",
      code: 200,
      message: `The drug has been sucessfully updated.`,
      body: {
        drug,
      },
    };
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  add_drug,
  toogle_availability,
  delete_drug,
  get_drug,
  get_drugs_owner,
  update_drugs,
};
