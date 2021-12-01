const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();
const mongoURL =
  process.env.MONGO_URL || "mongodb://localhost:27017/netflix-api";
const authRoute = require("./routes/auth");
const movieRoute = require("./routes/movie");
const userRoute = require("./routes/user");
const listRoute = require("./routes/list");
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoBD connected successfully...");
  })
  .catch((error) => {
    console.log("MongoDB has errors...");
    console.log(error);
  });

app.use(express.json());
app.use("/api/auth/", authRoute);
app.use("/api/movie/", movieRoute);
app.use("/api/user/", userRoute);
app.use("/api/list/", listRoute);

const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`on port ${port}...`);
});
