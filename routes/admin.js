const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

function dhm(t){
  var cd = 24 * 60 * 60 * 1000,
      ch = 60 * 60 * 1000,
      d = Math.floor(t / cd),
      h = Math.floor( (t - d * cd) / ch),
      m = Math.round( (t - d * cd - h * ch) / 60000),
      pad = function(n){ return n < 10 ? '0' + n : n; };
if( m === 60 ){
  h++;
  m = 0;
}
if( h === 24 ){
  d++;
  h = 0;
}
return [d, pad(h), pad(m)].join(':');
}

// Load Assigment and User Model
require('../models/Assigment');
const Assigment = mongoose.model('assigment');
require('../models/User');
const User = mongoose.model('users');

// Admin Index Page
router.get('/', (req, res) => {
  User.find()
  .then(users => {
    for(let user in users) {
      users[user].login = dhm(Date.now() - users[user].last_login);
      console.log(users[user].login);
    }
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