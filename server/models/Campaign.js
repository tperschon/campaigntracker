// import dependencies
const mongoose = require('mongoose'); 
const generateCode = require('../utils/generateCode');

const { Schema, SchemaTypes } = mongoose;

// export the model with the schema filled in
const campaignSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  admins: [{
    type: SchemaTypes.ObjectId,
    ref: 'User'
  }],
  players: [{
    type: SchemaTypes.ObjectId,
    ref: 'User'
  }],
  jCode: {
    type: String,
    required: true,
    default: generateCode()
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;