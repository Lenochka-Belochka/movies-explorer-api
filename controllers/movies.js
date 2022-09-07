const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const NotAllowedError = require('../errors/not-allowed-error');
const NotFoundError = require('../errors/not-found-error');
const {
  ERROR_DATA_FILM,
  ERROR_DATA_FILM_DELETE,
  MOVIE_NOT_FOUND,
  ACCESS_ERROR,
} = require('../utils/constants');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_DATA_FILM));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => next(new NotFoundError(MOVIE_NOT_FOUND)))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new NotAllowedError(ACCESS_ERROR));
      } else {
        movie.remove()
          .then(() => res.send({ message: movie }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_DATA_FILM_DELETE));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
