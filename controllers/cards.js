/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const Card = require('../models/card');

const {
  ERROR_CODE_SERVER_ERROR,
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res
      .status(ERROR_CODE_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId, { useFindAndModify: false })
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для удаления карточки',
        });
      }
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Передан несуществующий id карточки',
        });
      }
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Передан несуществующий id карточки',
        });
      }
      return res
        .status(ERROR_CODE_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
