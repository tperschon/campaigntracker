// import dependencies
const mongoose = require('mongoose'); 

const { Schema, SchemaTypes } = mongoose;
// export the model with the schema filled in
const noteSchema = new Schema({
  // A potentially-descriptive title of a Note
  title: {
    type: String,
    required: true,
    trim: true
  },
  // optional type for a note for future functionality
  noteType: {
    type: String
  },
  // Meaty content of the note
  text: {
    type: String
  },
  // the User who created the Note
  creator: {
    type: SchemaTypes.ObjectId,
    ref: 'User'
  },
  // the Campaign that the Note is for
  campaign: {
    type: SchemaTypes.ObjectId,
    ref: 'Campaign'
  }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
