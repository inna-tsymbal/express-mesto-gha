/* eslint-disable space-before-function-paren */
/* eslint-disable object-curly-spacing */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
mongoose.set('strictQuery', true);

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routeUsers);
app.use('/', routeCards);

// eslint-disable-next-line space-before-blocks
app.all('*', function(req, res){
  res.status(404);
  res.send({ message: 'Not Found'});
});

app.listen(PORT);
