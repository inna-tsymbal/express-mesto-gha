/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable function-paren-newline */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Поле должно быть заполнено"],
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: [true, "Поле должно быть заполнено"],
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: [true, "Поле должно быть заполнено"],
    },
  }, {versionKey: false });

module.exports = mongoose.model('user', userSchema);
