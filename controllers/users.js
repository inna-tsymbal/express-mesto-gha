/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable import/order */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/newline-after-import
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Такой пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('ID пользователя задан не корректно'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Такой пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('ID пользователя задан не корректно'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        const fieldName = '_doc';
        const userData = user[fieldName];
        delete userData.password;
        res.send({ data: userData });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Данные пользователя введены некорректно'));
        } else if ('MongoServerError') {
          next(new ConflictError('Пользователь с таким e-mail уже существует'));
        } else {
          next(err);
        }
      }))
    .catch(() => {
      next(new BadRequestError('Пароль пользователя задан некорректно'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      if (!bcrypt.compare(password, user.password)) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      })
        .send({ token })
        .end();
    })
    .catch((err) => {
      console.log(err);
      next(new UnauthorizedError('Логин или пароль пользователя введены неверно'));
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => (
      res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные пользователя введены некорректно'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => (
      res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные пользователя введены некорректно'));
      } else {
        next(err);
      }
    });
};
