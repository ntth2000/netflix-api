const express = require("express");
const router = express.Router();
const Movie = require("../models/movies");
const verify = require("../verifyToken");
const fetchList = require("../createDataBase/fetchMovie");

router.post("/createDatabase", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      fetchList();
      res.status(200).json("created DB");
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const newMovie = new Movie(req.body);
      const movie = await newMovie.save();
      res.status(200).json(movie);
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});
//find movie
router.get("/search", verify, async (req, res) => {
  const { q } = req.query;
  try {
    const movie = await Movie.find(
      {
        title: {
          $regex: new RegExp(q, "i"),
        },
      },
      {
        _id: 1,
      }
    );
    res.status(200).json(movie);
  } catch (error) {
    res.status(401).json(error);
  }
});
//update movie
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        //return updated movie
        { new: true }
      );
      res.status(200).json(movie);
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});

//get all movies
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      let condition;
      if (req.query.genre) {
        condition = { genre: req.query.genre };
      } else {
        condition = {};
      }
      const movies = await Movie.find(condition);
      res.status(200).json(movies.reverse());
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});
//get recommendation
router.get("/recommendation", verify, async (req, res) => {
  try {
    const movies = await Movie.aggregate([{ $sample: { size: 12 } }]);
    res.status(200).json(movies);
  } catch (error) {
    res.status(200).json(error);
  }
});
//get random movie
router.get("/random", verify, async (req, res) => {
  const { type } = req.query;
  let movie;
  try {
    if (type) {
      movie = await Movie.aggregate([
        { $match: { type: type } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([{ $sample: { size: 1 } }]);
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(401).json(error);
  }
});

//get one movie
router.get("/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    res.status(401).json(error);
  }
});

//delete movie
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted!");
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("You are not allow");
  }
});

module.exports = router;
