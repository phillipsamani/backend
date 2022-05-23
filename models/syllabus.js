const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const syllabusSchema = new mongoose.Schema(
  {
    category: { type: ObjectId, ref: "Category" },
    // years: [{ type: ObjectId, ref: "Year" }],
    // sections: [{ type: ObjectId, ref: "Section" }],
    strands: [{ type: ObjectId, ref: "Strand" }],
    subject: { type: ObjectId, ref: "Subject" },
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
