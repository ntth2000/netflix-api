const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

//register || create new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  //validate user input
  if (!(email && password)) {
    res.status(400).json("All input is required");
  }
  //check if email already exists
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res
      .status(409)
      .json("Email has been already used. Please enter another email!");
  }

  //encrypt user password
  const encryptedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUser = new User({
      ...req.body,
      password: encryptedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json(error);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(401).json("This email does not exist");
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.admin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...infor } = user._doc;

    bcrypt.compare(
      req.body.password,
      user.password,
      function (error, response) {
        if (error) {
          res.status(401).json(error);
        }
        if (response) {
          res.status(200).json({ ...infor, token });
        } else {
          res.status(401).json("Wrong password or email!");
        }
      }
    );
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = router;
