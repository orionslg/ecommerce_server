const { sign, verify } = require('jsonwebtoken');

module.exports = {
  generateToken(payload) {
    return sign(payload, process.env.SECRET_KEY);
  },

  verivyToken(token) {
    return verify(token, process.env.SECRET_KEY);
  }
}