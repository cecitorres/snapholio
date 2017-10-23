const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AssigmentSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  image:{
    imageName: String,
		imagePath: String,
		imageType: String,
		imageUrl: String
  },
  user:{
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('assigment', AssigmentSchema);