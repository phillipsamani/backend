const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const aimSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section" },
    differentiator: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    mtitle: {
      type: String,
    },
    excerpt: {
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

module.exports = mongoose.model("Aim", aimSchema);
