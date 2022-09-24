// import dependencies
import mongoose, { Schema } from 'mongoose';
import Note from './Note';
// export the model with the schema filled in
export default mongoose.model('Place', new Schema({
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
}));
