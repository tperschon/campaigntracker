// import dependencies
const mongoose = require('mongoose'); 

const { Schema } = mongoose;
const Note = require('./Note');
// export the model with the schema filled in
const itemSchema = new Schema({
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

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;