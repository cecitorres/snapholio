const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Load Assigment and User Model
require('../models/Assigment');
const Assigment = mongoose.model('assigment');
require('../models/User');
const User = mongoose.model('users');

// Admin Index Page
router.get('/', (req, res) => {
  User.find()
  .then(users => {
    res.render('admin/index', {
      users: users
    })
  });
});

// Profile User Page
router.get('/user/:id', (req, res) => {
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