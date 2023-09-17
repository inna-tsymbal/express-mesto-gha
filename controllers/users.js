/* eslint-disable semi */
/* eslint-disable consistent-return */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
/* eslint-disable indent */
const User = require('../models/user');
const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User
  .find({})
  .then((users) => res.send({ users }))
  .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      if (user) return res.send({ user });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Передан некорректный id' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
};

module.exports.updateUser = (req, res) => {
  const {name, about} = req.body;

  User.findById(req.user._id)
    .then((user) => {
      user.name = name;
      user.about = about;
      error = user.validateSync();

      if (!error) {
        return res.send({ user });
      }

      // eslint-disable-next-line semi
      res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении пользователя' })
    })
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении пользователя' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: err })
    ));
};

module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;

  User.findById(req.user._id)
    .then((user) => {
      user.avatar = avatar;
      error = user.validateSync();

      if (!error) {
        return res.send({ user });
      }

      res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' })
    })
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
};
