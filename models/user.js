/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    required: [true, 'Поле должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
