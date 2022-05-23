const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const substrandSchema = new mongoose.Schema(
  {

    subject: { type: ObjectId, ref: "Subject" },
    strand: { type: ObjectId, ref: "Strand" },
    year: { type: ObjectId, ref: "Year" },
    years: [{ type: ObjectId, ref: "Year" }],
    term: { type: ObjectId, ref: "Term" },
    terms: [{ type: ObjectId, ref: "Term" }],
    // sections: [{ type: ObjectId, ref: "Section" }],
    name: {
      type: String,    
    },

    periods: {
      type: Number,
    },
    statement: {
      type: String,
      max: 1000,
    },
    outcomes: [{ type: ObjectId, ref: "Outcome" }],
    mtitle: { type: String },
    mdesc: { type: String },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Substrand", substrandSchema);
