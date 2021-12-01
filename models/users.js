const mongoose = require("mongoose");
const Movie = require("./movies");
const UserSchema = new mongoose.Schema(
  {
    plan: { type: String },
    username: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    myList: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: Movie,
    },
    admin: { type: Boolean, default: false },
    DOB: Date,
    address: String,
    profileImg: {
      type: String,
      default:
        "https://ih1.redbubble.net/image.618427277.3222/flat,800x800,075,f.u2.jpg",
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
