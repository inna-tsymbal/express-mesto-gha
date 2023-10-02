/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');
const errorHandler = require('./middlewares/error-handler');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB_URL);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);

app.use(express.json());
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => next(new NotFoundError('Такая страница не существует.')));

app.use(errors());
app.use(errorHandler());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
