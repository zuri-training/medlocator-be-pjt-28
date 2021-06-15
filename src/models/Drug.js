const { Schema, model } = require("mongoose");

const drugSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    chemical_name: [{
        type: String,
        trim: true
    }],
    price: {
        type: String,
        trim: true
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store"
    }
});

module.exports = model("Drug",drugSchema);