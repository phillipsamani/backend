const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const termSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Term", termSchema);
