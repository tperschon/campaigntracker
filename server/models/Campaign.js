// import dependencies
import mongoose, { Schema } from 'mongoose';
// export the model with the schema filled in
export default mongoose.model('Campaign', new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  admins: {
    type: [Number]
  },
  players: {
    type: [Number]
  },
}));
