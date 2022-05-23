const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const acknowledgementSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section" },
    
    differentiator: {
      type: String,
    },
    title: {
      type: String,
    },

    body: { type: String },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Acknowledgement", acknowledgementSchema);