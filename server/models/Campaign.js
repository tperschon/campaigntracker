// import dependencies
const mongoose = require('mongoose'); 
const generateCode = require('../utils/generateCode');

const { Schema } = mongoose;

// export the model with the schema filled in
const campaignSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  admins: {
    type: Number
  },
  players: {
    type: [Number]
  },
  jCode: {
    type: String,
    required: true,
    default: generateCode(),
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;