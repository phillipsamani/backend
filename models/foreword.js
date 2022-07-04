const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const forewordSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section"},
    title: {
      type: String,
      required: true
    },
    differentiator: {    
      type: String,
      required: true
    },
    body: { 
      type: String,
      required: true
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Foreword", forewordSchema);