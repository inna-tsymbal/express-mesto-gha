/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable space-before-function-paren */
/* eslint-disable object-curly-spacing */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const express = require('express');
const mongoose = require('mongoose');
const ERROR_CODE_SERVER_ERROR = require("./errors/errors");
const helmet = require('helmet');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to DB");
})
.catch((err) => {
  console.log("Ошибка с подключением базы данных:", err);
  return res
    .status(ERROR_CODE_SERVER_ERROR)
    .send({ message: "На сервере произошла ошибка" });
});

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };
  next();
});

app.use(routeUsers);

app.use(routeCards);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
