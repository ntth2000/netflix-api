const axios = require("axios");
const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];
const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

const fetchMovie = async (request, movieType) => {
  try {
    const res = await axios.get(request);
    const newMovie = {
      genre: res.data.genres,
      title:
        res.data.original_title ||
        res.data.original_name ||
        res.data.name ||
        res.data.title,
      type: movieType,
      year: parseInt(
        res.data.release_date?.slice(0, 4) ||
          res.data.first_air_date.slice(0, 4)
      ),
      duration:
        movieType === "movie"
          ? `${res.data.runtime} min`
          : `${res.data.number_of_seasons} seasons`,
      countries: res.data.production_countries.map((country) => country.name),
      languages: res.data.spoken_languages.map(
        (language) => language.english_name
      ),
      img: `https://image.tmdb.org/t/p/original/${
        res.data.backdrop_path || res.data.poster_path
      }`,
      titleImg: `https://image.tmdb.org/t/p/original/${
        res.data.backdrop_path || res.data.poster_path
      }`,
      video:
        res.data.video ||
        `https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4`,
      trailer:
        res.data.video ||
        `https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4`,
      thumbnailImg: `https://image.tmdb.org/t/p/original/${
        res.data.backdrop_path || res.data.poster_path
      }`,
      desc: res.data.overview,
    };
    //await newMovie.save();
    return newMovie;
  } catch (error) {
    console.log(error);
  }
};
const Movie = require("../models/movies");
const List = require("../models/lists");
const fetchList = async () => {
  await List.deleteMany({});
  await Movie.deleteMany({});
  MOVIE_GENRES.forEach(async (element) => {
    const movieGenreID = element.id;
    const newList = new List({
      title: `${element.name} Movies`,
      genre: [element.name],
      type: "movie",
      content: [],
    });
    const savedList = await newList.save();
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.THEMOVIEDB_API_KEY}&with_genres=${movieGenreID}`
      );
      await res.data.results.forEach(async (movieElement, i) => {
        if (i < 10) {
          try {
            const movieID = movieElement.id;
            const movieResponse = await fetchMovie(
              `
          https://api.themoviedb.org/3/movie/${movieID}?api_key=${process.env.THEMOVIEDB_API_KEY}&language=en-US`,
              "movie"
            );
            const newMovie = new Movie(movieResponse);
            const savedMovie = await newMovie.save();
            //console.log("movie:", savedMovie.title);
            await List.findByIdAndUpdate(savedList._id, {
              $push: { content: savedMovie._id },
            });
            //console.log("list:", await List.findById(savedList._id));
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  TV_GENRES.forEach(async (element) => {
    const movieGenreID = element.id;
    const newList = new List({
      title: `${element.name} TV Series`,
      genre: [element.name],
      type: "series",
      content: [],
    });
    const savedList = await newList.save();
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.THEMOVIEDB_API_KEY}&with_genres=${movieGenreID}`
      );
      await res.data.results.forEach(async (movieElement, i) => {
        if (i < 10) {
          try {
            const movieID = movieElement.id;
            const movieResponse = await fetchMovie(
              `
          https://api.themoviedb.org/3/tv/${movieID}?api_key=${process.env.THEMOVIEDB_API_KEY}&language=en-US`,
              "series"
            );
            const newMovie = new Movie(movieResponse);
            const savedMovie = await newMovie.save();
            //console.log("movie:", savedMovie.title);
            await List.findByIdAndUpdate(savedList._id, {
              $push: { content: savedMovie._id },
            });
            console.log("list:", await List.findById(savedList._id));
            console.log(movieResponse);
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
};
//fetchList();
module.exports = fetchList;

// fetchMovie();
//module.exports = newMovie;
