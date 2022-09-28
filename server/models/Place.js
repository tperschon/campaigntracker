// import dependencies
const mongoose = require('mongoose'); 

const { Schema } = mongoose;
const Note = require('./Note');

// export the model with the schema filled in
const placeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  canSee: {
    type: [Number],
  },
  campaign: {
    type: Number
  },
  notes: [Note.schema]
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
