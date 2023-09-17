/* eslint-disable indent */
const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch(() => res.status(404).send({ message: 'Страница не найдена' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          // eslint-disable-next-line no-shadow
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .orFail(new Error('NotValiId'))
  .then(() => res.status(200).send({ message: 'Карточка удалена' }))
  .catch((err) => {
    if (err.message === 'NotValiId') {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    if (err.name === 'CastError') {
      return res.status(400).send({
        message: 'Некорректный  id',
      });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValiId'))
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'Пользователь не найден',
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Некорректный id пользователя',
        });
      }
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValiId'))
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'Пользователь не найден',
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Некорректный id пользователя',
        });
      }
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
