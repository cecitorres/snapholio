const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const {
  ensureAuthenticated
} = require('../helpers/auth');

// Load Assigment Model
require('../models/Assigment');
const Assigment = mongoose.model('assigment');

// Set Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: images only');
  }
}

// Assigment Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Assigment.find({
      user: req.user.id
    })
    .sort({
      date: 'desc'
    })
    .then(assigments => {
      res.render('assigments/index', {
        assigments: assigments
      });
    });
});

// Add Assigment Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('assigments/add');
});

// Edit Assigment Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Assigment.findOne({
      _id: req.params.id
    })
    .then(assigment => {
      if (assigment.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/assigments');
      } else {
        res.render('assigments/edit', {
          assigment: assigment
        });
      }

    });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  
  if (req.body.title == "") {
    errors.push({
      text: 'Please add a title'
    });
  }  
  
  if (errors.length > 0) {
    res.render('assigments/add', {
      errors: errors,
      title: req.body.title,
      tries: tries
      // details: req.body.details
    });
  } else {
    // Example in multer
    upload(req, res, (err) => {
      let tries = req.body.tries;
      if (req.user.isGuineaPig == true) {
        if(tries == 3) {
          tries = 0;
        }
        else {
          tries++;
          errors.push({
            text: 'Unknown error, please try again :('
          });
        }
      }
      if (err || errors.length > 0) {
        console.log(tries);
        // errors.push({
        //   text: 'Error: please try again'
        // });
        res.render('assigments/add', {
          errors: errors,
          title: req.body.title,
          tries: tries          
          // details: req.body.details
        });
      } else {
        if (req.file == undefined) {
          errors.push({
            text: 'Error: No File Selected!'
          });
          res.render('assigments/add', {
            errors: errors,
            title: req.body.title,
            // details: req.body.details
          });
        } else {
          const newAssigment = {
            title: req.body.title,
            image: {
              imageName: req.file.filename,
              imagePath: req.file.path,
              imageType: req.file.mimetype,
              imageUrl: 'uploads/' + req.file.filename
            },
            user: req.user.id
          }
          new Assigment(newAssigment)
            .save()
            .then(assigment => {
              req.flash('success_msg', 'Assigment added');
              res.redirect('/assigments');
            })
        }
      }
    });


  }
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Assigment.findOne({
      _id: req.params.id
    })
    .then(assigment => {
      // new values
      upload(req, res, (err) => {
        assigment.title = req.body.title;

        if(req.file != undefined) {   //Si hay imagen nueva
          assigment.image.imageName = req.file.filename;
          assigment.image.imagePath = req.file.path;
          assigment.image.imageType = req.file.mimetype;
          assigment.image.imageUrl = 'uploads/' + req.file.filename;
        }
  
        assigment.save()
          .then(assigment => {
            req.flash('success_msg', 'Assigment updated');
            res.redirect('/assigments');
          })
      });
    });
});

// Delete Assigment
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Assigment.remove({
      _id: req.params.id
    })
    .then(() => {
      req.flash('success_msg', 'Assigment removed');
      res.redirect('/assigments');
    });
});

module.exports = router;