const mongoose = require("mongoose");
const List = require("./lists");
const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: [Object],
      required: true,
    },
    type: { type: String, enum: ["series", "movie"] },
    desc: String,
    year: Number,
    duration: String,
    countries: [String],
    languages: [String],
    img: { type: String },
    titleImg: { type: String },
    thumbnailImg: { type: String },
    video: { type: String },
    trailer: { type: String },
  },
  { timestamps: { createdAt: "created_at" } }
);
MovieSchema.post("findOneAndDelete", async function (data) {
  console.log("delete data", data);
  if (data) {
    await List.remove({
      _id: data._id,
    });
  }
});

const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
