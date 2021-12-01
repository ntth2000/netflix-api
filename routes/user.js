const express = require("express");
const router = express.Router();
const User = require("../models/users");
const verify = require("../verifyToken");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

//update user
router.put("/:id", verify, async (req, res) => {
  //   //if user changes password
  if (req.body.password) {
    //encrypt password before storing
    const encryptedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = encryptedPassword;
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      //return updated user
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json(error);
  }
});

//get all users
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const users = await User.find();
      res.status(200).json(users.reverse());
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});

//get one user
router.get("/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json(error);
  }
});

//delete user
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("The account has been deleted!");
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});
router.put("/:id/my-list", verify, async (req, res) => {
  try {
    await User.findByIdAndUp(
      req.params.id,
      { $set: req.body },
      //return updated movie
      { new: true }
    );
    res.status(200).json("The account has been deleted!");
  } catch (error) {
    res.status(401).json(error);
  }
});
module.exports = router;
