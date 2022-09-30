// import dependencies
const mongoose = require('mongoose'); 
const generateCode = require('../utils/generateCode');

const { Schema, SchemaTypes } = mongoose;

// export the model with the schema filled in
const campaignSchema = new Schema({
  // the name of the Campaign, what people will call it, should be renderable
  name: {
    type: String,
    required: true,
    trim: true
  },
  // an array of Users who have administrative access, these people can see the jCode and create/see Notes for a Campaign
  admins: [{
    type: SchemaTypes.ObjectId,
    ref: 'User'
  }],
  // an array of Users who are participating in the campaign, they get added by utilizing the jCode to be 'invited', they can see Notes for a Campaign
  players: [{
    type: SchemaTypes.ObjectId,
    ref: 'User'
  }],
  // this property is a randomly generated string that serves as a way to pull up a Campaign and add a User to its 'players' property
  jCode: {
    type: String,
    required: true,
    default: generateCode()
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;