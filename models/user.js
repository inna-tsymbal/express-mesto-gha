/* eslint-disable semi */
/* eslint-disable function-paren-newline */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator(name) {
          return name.length >= 2 && name.length <= 30
        },
        message: 'Имя пользователя должно содержать от 2 до 30 символов',
      },
    },
    about: {
      type: String,
      required: true,
      validate: {
        validator(about) {
          return about.length >= 2 && about.length <= 30
        },
        message: 'Информация о пользователе должна содержать от 2 до 30 символов',
      },
    },
    avatar: {
      type: String,
      required: true,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
);

module.exports = mongoose.model('user', userSchema);
