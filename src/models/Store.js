const { Schema, model } = require("mongoose");

const storeSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    drugs: [{
        type: Schema.Types.ObjectId,
        ref: "Drug"
    }],
    contact: {
        owner: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        }
    }
});

module.exports = model("Store",storeSchema);