const { AuthenticationError, UserInputError } = require('apollo-server-express');
const mongoose = require('mongoose');
const { User, Campaign, Note } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  /////////////
  // QUERIES //
  /////////////
  Query: {
    // get the user by the user.id in context
    user: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id).populate({ path: 'campaigns', model: Campaign });
      }
      throw new AuthenticationError('Not logged in');
    },
    // get the campaign by the campaign.id in context
    campaign: async (parents, { campaignId }) => {
      let campaign = await Campaign.findById(campaignId);
      await campaign.populate({ path: 'players', model: User });
      await campaign.populate({ path: 'admins', model: User });
      if (!campaign) {

        throw new UserInputError('Campaign not found.');
      }
      return campaign;
    },
    // get campaigns associated with user
    getUserCampaigns: async (parent, { userId }, context) => {
      const user = await User.findById(userId);
      await user.populate({ path: 'campaigns', model: Campaign });
      return user.campaigns;
    },
    // get notes associated with campaign, if any
    getCampaignNotes: async (parent, { campaignId }, context) => {
      if(context.user) {
        const notes = await Note.find({ campaign: mongoose.Types.ObjectId(campaignId) } );
        return notes;
      };
      throw new AuthenticationError('Not logged in')
    }
  },
  ///////////////
  // MUTATIONS //
  ///////////////
  Mutation: {
    // adds a user and signs them in via token
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    // user creates campaign
    addCampaign: async (parent, args, context) => {
      if (!context.user) {
        console.log(`User not in context: ${context.user}`)
        throw new AuthenticationError('Invalid Token')
      };
      const user = await User.findById(context.user._id);
      const newCampaign = { ...args, admins: [user._id] };
      const campaign = await Campaign.create(newCampaign);
      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { "$push": { campaigns: campaign } });
      await campaign.populate({ path: 'admins', model: User });
      return campaign;
    },
    // user logs in
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      };
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      };
      const token = signToken(user);
      return { token, user };
    },
    // user joins a campaign with a provided code
    joinCampaign: async (parent, { jCode }, context) => {
      const campaign = await Campaign.findOne({ where: { jCode: jCode } });
      const user = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { "$push": { campaigns: campaign._id } }
      );
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        { _id: campaign._id },
        { "$push": { players: user._id } }
      );
      return { user, campaign };
    },
    // admin adds note to a campaign
    addNote: async (parent, { title, text, campaignId }, context) => {
      console.log("run")
      if (!context.user) {
        console.log('Invalid Token');
        throw new AuthenticationError('Invalid Token');
      };
      const note = await Note.create({
        title: title,
        text: text,
        creator: context.user._id,
        campaign: campaignId
      });
      await note.populate({ path: 'campaign', model: Campaign });
      await note.populate({ path: 'creator', model: User });
      return note;
    },
    // admin removes note from a campaign
    removeNote: async (parent, { id }, context) => {
      const removedNote = await Note.findOneAndDelete({
        _id: id
      });
      if (removedNote) {
        return removedNote;
      };
      throw new UserInputError('Note does not exist');
    },
  },
};

module.exports = resolvers;