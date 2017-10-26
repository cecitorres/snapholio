const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true
  },
  isGuineaPig: {
    type: Boolean,
    default: false,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  last_login: {
    type: Date,
    default: Date.now
  }
});

UserSchema.statics.login = function login(id, callback) {
  return this.findByIdAndUpdate(id, {
      $set: {
        'last_login': Date.now()
      }
    }, {
      new: true
    },
    callback);
};

mongoose.model('users', UserSchema);