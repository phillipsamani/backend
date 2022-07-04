const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const groupSchema = new mongoose.Schema(
    {
        teacher: { type: ObjectId, ref: "User" },
        year: { type: ObjectId, ref: "Year" },
        description: {
            type: String,
            required: true,   
        },
        school: {
            type: String,
            required: true,
        },
        authority: {
            type: String,
            required: true,
        },
        users: [{ type: ObjectId, ref: "User" }],
        slug: {
            type: String,
            unique: true,
            index: true,
        },
    },
    { timestamp: true }
);

module.exports = mongoose.model("Group", groupSchema);
