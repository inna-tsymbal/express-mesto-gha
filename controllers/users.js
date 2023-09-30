/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable import/order */
const { Error } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/newline-after-import
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { SECRET_PASSWORD_KEY } = require('../utils/constants');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_PASSWORD_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному `_id` не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному `_id` не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован.'));
      }
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(new NotFoundError('Пользователь по указанному `_id` не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(new NotFoundError('Пользователь по указанному `_id` не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении автара.'));
      }
      next(err);
    });
};
