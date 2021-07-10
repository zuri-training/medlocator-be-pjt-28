const { Schema, model } = require("mongoose");

const drugSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    uniqiue: true,
    maxlength: 20,
    minlength: 1,
  },
  chemical_name: [
    {
      type: String,
      trim: true,
      required: true,
      maxlength: 20,
      minlength: 1,
    },
  ],
  price: {
    type: Number,
    trim: true,
    required: true,
    max: 1000000,
    min: 1,
  },
  available: {
    type: Boolean,
    required: true,
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
});

drugSchema.methods.toJSON = function () {
  const drug_json = this.toObject();
  delete drug_json.__v;
  return drug_json;
};

module.exports = model("Drug", drugSchema);
