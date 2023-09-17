/* eslint-disable comma-dangle */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable arrow-body-style */
/* eslint-disable no-shadow */
/* eslint-disable indent */
const mongoose = require("mongoose");
const Card = require('../models/card');

const {
  ERROR_CODE_SERVER_ERROR,
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
} = require('../errors/errors');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      return res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        return res
          .status(ERROR_CODE_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      return res.status(200).send({ data: cards });
    })
    .catch((err) => {
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId, { useFindAndModify: false })
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else {
        return res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: "Переданы некорректные данные для удаления карточки",
        });
      } else {
        return res
          .status(ERROR_CODE_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else {
        return res.status(201).send({ data: card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: "Передан несуществующий _id карточки",
        });
      } else {
        return res
          .status(ERROR_CODE_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else {
        return res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: "Передан несуществующий _id карточки",
        });
      } else {
        return res
          .status(ERROR_CODE_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};
