/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const User = require('../models/user');
const {
  ERROR_CODE_SERVER_ERROR,
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res
      .status(ERROR_CODE_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(ERROR_CODE_BAD_REQUEST)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

let currentName; let
  currentAbout;

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name || currentName,
      about: req.body.about || currentAbout,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: 'Пользователь с указанным ID не найден',
        });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.wrongUrl = (req, res) => res.status(ERROR_CODE_NOT_FOUND).send({
  message: 'Неверный адрес страницы',
});
