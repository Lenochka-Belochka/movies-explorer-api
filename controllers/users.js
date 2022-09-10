const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const DuplicateError = require('../errors/duplicate-error');
const BadRequestError = require('../errors/bad-request-error');
const {
  USER_NOT_FOUND,
  ERROR_DATA_PROFILE,
  ERROR_DATA_USER,
  EMAIL_IN_BASE,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const createNewUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_DATA_USER));
      } else if (err.code === 11000) {
        next(new DuplicateError(EMAIL_IN_BASE));
      } else {
        next(err);
      }
    });
};

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND);
    })
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_DATA_PROFILE));
      } else if (err.code === 11000) {
        next(new DuplicateError(EMAIL_IN_BASE));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getCurrentUserInfo, updateUserInfo, createNewUser, login,
};
