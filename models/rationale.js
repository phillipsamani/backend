const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const rationaleSchema = new mongoose.Schema(
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
      max: 100,
    },
    body: {
      type: String,
      required: true,
      max: 1000,
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

module.exports = mongoose.model("Rationale", rationaleSchema);
