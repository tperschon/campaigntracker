// import dependencies
const mongoose = require('mongoose'); 

const { Schema, SchemaTypes } = mongoose;
// export the model with the schema filled in
const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  noteType: {
    type: String
  },
  text: {
    type: String
  },
  creator: {
    type: SchemaTypes.ObjectId,
    ref: 'User'
  },
  campaign: {
    type: SchemaTypes.ObjectId,
    ref: 'Campaign'
  }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
