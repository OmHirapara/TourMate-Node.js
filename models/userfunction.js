const User = require('./userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

User.prototype.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function(JWTTimestamp) {
  if (this.password_changed_at) {
    console.log('time', this.password_changed_at, JWTTimestamp);
    const changedTimestamp = parseInt(
      this.password_changed_at.getTime() / 1000,
      10
    );
    console.log('time', changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

User.prototype.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.password_reset_token);

  this.password_reset_expires = Date.now() + 100 * 60 * 1000;

  return resetToken;
};

User.prototype.validatePassword = function(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return regex.test(password);
};

User.prototype.passwordMatch = function(password, password_confirm) {
  if (password !== password_confirm) {
    return true;
  }
  return false;
};

module.exports = User;
