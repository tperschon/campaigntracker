// import dependencies
import mongoose, { Schema } from 'mongoose';
// export the model with the schema filled in
export default mongoose.model('Character', new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  canSee: {
    type: Array,
  },
  campaign: {
    type: Number
  },
}));
