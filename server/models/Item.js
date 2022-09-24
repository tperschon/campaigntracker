// import dependencies
import mongoose, { Schema } from 'mongoose';
// export the model with the schema filled in
export default mongoose.model('Item', new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // information, character, item, place
  canSee: {
    type: Array,
  },
  campaign: {
    type: Number
  },
}));
