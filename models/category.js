const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
    {
        years: [{ type: ObjectId, ref: "Year" }],
        name: {
            type: String,
            required: true,
       
        },
        description: {
            type: String,
            required: true,   
        },

        slug: {
            type: String,
            unique: true,
            index: true,
        },
    },
    { timestamp: true }
);

module.exports = mongoose.model("Category", categorySchema);
