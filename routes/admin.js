const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const router = express.Router();

const {
  ensureAdmin
} = require('../helpers/auth');

// Load Assigment and User Model
require('../models/Assigment');
const Assigment = mongoose.model('assigment');
require('../models/User');
const User = mongoose.model('users');

// Admin Index Page
router.get('/', ensureAdmin, (req, res) => {
  User.find()
  .then(users => {
    for(let user in users) {
      users[user].login = moment(users[user].last_login).fromNow();
    }
    res.render('admin/index', {
      users: users
    })
  });
});

// Profile User Page
router.get('/user/:id', ensureAdmin, (req, res) => {
  Assigment.find({
    user: req.params.id
  })
  .then(assigments => {
    res.render('admin/user', {
      assigments: assigments
    })
  });
});

module.exports = router;