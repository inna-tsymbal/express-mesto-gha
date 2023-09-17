/* eslint-disable no-shadow */
/* eslint-disable indent */
const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((card) => res.status(201).send(card))
        .catch(() => res.status(404).send({ message: 'Not Found' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          // eslint-disable-next-line no-shadow
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .orFail(new Error('NotValiId'))
  .then(() => res.status(200).send({ message: 'OK' }))
  .catch((err) => {
    if (err.message === 'NotValiId') {
      return res.status(404).send({ message: 'Not Found' });
    }
    if (err.name === 'CastError') {
      return res.status(400).send({
        message: 'Error Bad Request',
      });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
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
          message: 'Not Found',
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Error Bad Request',
        });
      }
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'Not Found',
        });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
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
          message: 'Not Found',
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Error Bad Request',
        });
      }
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'Not Found',
        });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};
