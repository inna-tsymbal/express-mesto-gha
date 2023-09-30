/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexp } = require('../utils/regexp');

const {
  getUsers, getUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.post('/users/me', getUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexp),
  }),
}), updateAvatar);

module.exports = router;
