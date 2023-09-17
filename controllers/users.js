/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable comma-dangle */
/* eslint-disable no-else-return */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable semi */
/* eslint-disable consistent-return */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
/* eslint-disable indent */
const mongoose = require("mongoose");
const User = require('../models/user');
const {
  ERROR_CODE_SERVER_ERROR,
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
  // вернём записанные в базу данные
  .then((users) => {
    return res.status(200).send({ data: users });
  })
  .catch((err) => {
    return res
      .status(ERROR_CODE_SERVER_ERROR)
      .send({ message: "На сервере произошла ошибка" });
  });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: "Пользователь с указанным _id не найден",
        });
      } else {
        return res.send({data: user});
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(ERROR_CODE_BAD_REQUEST)
          .send({ message: "Пользователь по указанному _id не найден" });
      } else {
        return res
          .status(ERROR_CODE_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => {
      return res.status(201).send({ data: user });
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        return res
          .status(ERROR_CODE_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

let currentName, currentAbout;

module.exports.updateUser = (req, res) => {
  User.findById(req.user._id)
  .then((user) => {
    currentName = user.name;
    currentAbout = user.about;
  })
  .catch((err) => {
    return res
      .status(ERROR_CODE_SERVER_ERROR)
      .send({ message: "На сервере произошла ошибка" });
  });

User.findByIdAndUpdate(
  req.user._id,
  {
    name: req.body.name || currentName,
    about: req.body.about || currentAbout,
  },
  {
    new: true,
    runValidators: true,
  }
)
  .then((user) => {
    if (!user) {
      return res.status(ERROR_CODE_NOT_FOUND).send({
        message: "Пользователь с указанным _id не найден",
      });
    } else {
      return res.status(200).send({ data: user });
    }
  })
  // данные не записались, вернём ошибку
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_CODE_BAD_REQUEST).send({
        message: "Переданы некорректные данные при обновлении профиля",
      });
    } else {
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    }
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
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: "Пользователь с указанным _id не найден",
        });
      } else {
        return res.status(200).send({ data: user });
      }
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      } else {
        return res
          .status(ERROR_CODE_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.wrongUrl = (req, res) => {
  return res.status(ERROR_CODE_NOT_FOUND).send({
    message: "Неверный адрес страницы",
  });
};
