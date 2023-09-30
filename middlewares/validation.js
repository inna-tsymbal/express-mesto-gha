/* eslint-disable linebreak-style */
const { celebrate, Joi } = require('celebrate');

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

module.exports.validateRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    avatar: Joi.string().uri({
      scheme: [
        'http',
        'https',
      ],
    }),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});
