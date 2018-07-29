const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

UserSchema.pre('save', function (next) {
  const user = this;

  console.log(user.password);

  bcrypt.hash(user.password, 10, (err, hash) => {
    if(err) return next(err);

    console.log(user.password);

    user.password = hash;
    return next();
  });
});

UserSchema.statics.authenticate = (email, password, next) => {
  User.findOne({ email }).exec((err, user) => {
    if(err) {
      return next(err);
    } else if(!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return next(err);
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) {
        return next(null, user);
      }
      return next();
    });
  });
}

const User = mongoose.model('User', UserSchema);
module.exports = User;
