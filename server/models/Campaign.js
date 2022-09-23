// import dependencies
import mongoose, { Schema } from 'mongoose';
import User from './User';
// export the model with the schema filled in
export default mongoose.model('Campaign', new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  admins: [User.schema],
  players: [User.schema],
}));
