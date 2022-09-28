// import dependencies
const mongoose = require('mongoose'); 

const { Schema } = mongoose;
// export the model with the schema filled in
const noteSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  canSee: {
    type: [Number],
  },
  text: {
    type: String
  },
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
