/* eslint-disable linebreak-style */
const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла неизвестная ошибка'
        : message,
    });
  return next();
};

module.exports = errorHandler;
