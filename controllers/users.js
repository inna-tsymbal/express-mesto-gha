/* eslint-disable indent */
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValiId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValiId') {
        return res.status(404).send({ message: 'Not Found' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Error Bad Request' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};

module.exports.createUser = (req, res) => {
  const newUserData = req.body;
  return User.create(newUserData)
    .then((newUser) => res.status(201).send(newUser))
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

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
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

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
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
