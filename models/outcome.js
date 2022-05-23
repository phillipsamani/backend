const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const outcomeSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    strand: { type: ObjectId, ref: "Strand" },
    years: [{ type: ObjectId, ref: "Year" }],
    terms: [{ type: ObjectId, ref: "Term" }],
    year: { type: ObjectId, ref: "Year" },
    term: { type: ObjectId, ref: "Term" },
    substrand: { type: ObjectId, ref: "Substrand" },
    
    general: { type: {} },
    assessment: { type: {} },
    indicators: { type: {} },
    mtitle: { type: String },
    photo: {
      data: Buffer,
      contentType: String,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },

  { timestamp: true }
);

module.exports = mongoose.model("Outcome", outcomeSchema);
