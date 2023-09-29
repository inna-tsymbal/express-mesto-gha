/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const ERROR_CODE_UNAUTHORIZED_ERROR = require('../errors/errors');

const { KEY = 'uXDm8ygPYPzEJ3qbycmZ' } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_CODE_UNAUTHORIZED_ERROR).send({
      message: 'Необходима авторизация',
    });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, KEY);
  } catch (err) {
    return res.status(ERROR_CODE_UNAUTHORIZED_ERROR).send({
      message: 'Необходима авторизация',
    });
  }
  req.user = payload;
  next();
};
