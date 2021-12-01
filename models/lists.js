const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    type: {
      type: String,
      enums: ["series", "movie"],
    },
    content: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Movie",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

const List = mongoose.model("List", ListSchema);
module.exports = List;
