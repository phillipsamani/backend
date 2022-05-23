const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const yearSchema = new mongoose.Schema(
  {
    name: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Year", yearSchema);
