const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const strandSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Subject" },
    level: { type: ObjectId, ref: "Year" },
    years: [{ type: ObjectId, ref: "Year" }],
    substrands: [{ type: ObjectId, ref: "Substrand" }],
    name: {
      type: String,
      required: true
    },
    introduction: {
      type: String,
        },
    statement: {
      type: String,
      required: true,

    },


    mtitle: {
      type: String,
    },
    mdesc: {
      type: String,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Strand", strandSchema);
