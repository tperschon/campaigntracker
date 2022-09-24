// import dependencies
import mongoose, { Schema } from 'mongoose';
import Campaign from './Campaign';
// export the model with the schema filled in
export default mongoose.model('Note', new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // information, character, item, place
  noteType: {
    type: String,
    require: true,
  },
  isChildOf: {
    type: Array,
  },
  campaign: [Campaign.schema],
  text: {
    type: String
  },
}));
