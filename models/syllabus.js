const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const syllabusSchema = new mongoose.Schema(
  {
    category: { type: ObjectId, ref: "Category" },
    strands: [{ type: ObjectId, ref: "Strand" }],
    subject: { type: ObjectId, ref: "Subject" },
    years: [{ type: ObjectId, ref: "Year" }],
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    excerpt: {
      type: String,
      max: 1000,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

  },
  { timestamp: true }
);

module.exports = mongoose.model("Syllabus", syllabusSchema);
