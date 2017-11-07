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
  Assigment.find({
      user: req.user.id
    })
    .then(assigment => {
      let numberofassigments = assigment.length + 1;
      res.render('assigments/add', {
        number: numberofassigments
      });
    });
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
  let numberofassigments;

  Assigment.count({
      user: req.user.id
    })
    .then(assigment => {
      console.log(`Assigment count: ${assigment}`);
      numberofassigments = (assigment == 0) ? 1 : assigment + 1;
      console.log(`Number Assigment: ${numberofassigments}`);
      upload(req, res, (err) => {
        let tries = req.body.tries; // Obtenemos el número de intentos
        if (req.user.isGuineaPig == true && (numberofassigments == 2 || numberofassigments == 6) && tries < 3) { // Si el user es de prueba y es la tarea 2 o 6
          tries++;
          console.log("Tries: " + tries);
          errors.push({
            text: 'Unknown error, please try again :('
          });
          res.render('assigments/add', {
            errors: errors,
            title: "Tarea " + numberofassigments,
            tries: tries
          });
        } else {
          if (req.file == undefined) {
            errors.push({
              text: 'Error: No File Selected!'
            });
            res.render('assigments/add', {
              errors: errors,
              title: "Tarea " + numberofassigments,
              tries: tries
            });
          } else {
            const newAssigment = {
              title: "Tarea " + numberofassigments,
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
    });

  // Example in multer
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

        if (req.file != undefined) { //Si hay imagen nueva
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