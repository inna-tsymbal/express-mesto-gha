/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const CardsRouter = require('./routes/cards');
const UserRouter = require('./routes/users');
const auth = require('./middlewares/auth');
const { regexp } = require('./utils/regexp');

const port = 3000;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('No connection to DB');
  });

app.get('/', (req, res) => {
  res.status(200).send('Hello!');
});

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use(CardsRouter);
app.use(UserRouter);
app.use('/*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send(
    { message: statusCode === 500 ? 'На сервере произошла ошибка' : message },
  );
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
