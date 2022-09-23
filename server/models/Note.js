// import dependencies
import mongoose, { Schema } from 'mongoose';
// export the model with the schema filled in
export default mongoose.model('Note', new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // information, character, item, place
  type: {
    type: String,
    require: true,
  },
  isChildOf: {
    type: Array,
  },
  text: {
    type: String
  },
}));
