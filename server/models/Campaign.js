// import dependencies
const mongoose = require('mongoose'); 

const { Schema } = mongoose;

// export the model with the schema filled in
const campaignSchema = new Schema({
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
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;