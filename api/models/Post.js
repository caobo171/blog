const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    status: {
      type: Number
    },
    answer_accept: {
      id: { type: String },
      content: { type: String }
    },
    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

PostSchema.index({ '$**': 'text' });

module.exports = mongoose.model("Post", PostSchema);
