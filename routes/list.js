const express = require("express");
const router = express.Router();
const List = require("../models/lists");
const verify = require("../verifyToken");
const Movie = require("../models/movies");

//create new list
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const newList = new List(req.body);
      const list = await newList.save();
      res.status(200).json(list);
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});

//update list
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const list = await List.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        //return updated movie
        { new: true }
      );
      res.status(200).json(list);
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});

//get all lists
router.get("/", verify, async (req, res) => {
  const { type, genre } = req.query;
  try {
    let lists;
    if (type) {
      if (genre) {
        lists = await List.aggregate([
          { $match: { type: type, genre: genre } },
        ]);
      } else {
        lists = await List.aggregate([{ $match: { type: type } }]);
      }
    } else {
      lists = await List.aggregate([{ $sample: { size: 20 } }]);
    }
    res.status(200).json(lists);
  } catch (error) {
    res.status(401).json(error);
  }
});

//get one list
router.get("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const list = await List.findById(req.params.id);
      res.status(200).json(list);
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});

//delete list
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json("The list has been deleted!");
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});

module.exports = router;
