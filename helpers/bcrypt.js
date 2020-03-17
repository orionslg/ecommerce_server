const { genSaltSync, hashSync, compareSync} = require('bcryptjs');

module.exports = {
  hashPassword(password) {
    const salt = genSaltSync(+process.env.SALT);
    return hashSync(password, salt);
  },

  comparePassword(password, hashedPassword) {
    return compareSync(password, hashedPassword);
  }
}