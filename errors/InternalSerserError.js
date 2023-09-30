/* eslint-disable linebreak-style */
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    // eslint-disable-next-line linebreak-style
    this.statusCode = 500;
    this.name = 'InternalServer';
  }
}

module.exports = InternalServerError;
