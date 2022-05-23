const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const indicatorSchema = new mongoose.Schema(
    {

        subject: { type: ObjectId, ref: "Subject" },
        strand: { type: ObjectId, ref: "Strand" },
        substrand: { type: ObjectId, ref: "Substrand" },
        years: [{ type: ObjectId, ref: "Year" }],
        year: { type: ObjectId, ref: "Year" },
        terms: [{ type: ObjectId, ref: "Term" }],
        term: { type: ObjectId, ref: "Term" },
        content: { type: String },    
        specific: { type: String },
        activity: { type: {}, max: 1000 },
        assessment: { type: {}, max: 1000 },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
    },

    { timestamp: true }
);

module.exports = mongoose.model("Indicator", indicatorSchema);
