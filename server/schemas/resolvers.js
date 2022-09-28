const { AuthenticationError } = require('apollo-server-express');
const { User, Campaign, Note } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    // get the user by the user.id in context
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user.id).populate({
          path: '',
          populate: '',
        });

        return user;
      }
      throw new AuthenticationError('Not logged in');
    },
    // get the campaign by the campaign.id in context
    campaign: async (parents, args, context) => {
      if (context.campaign) {
        const campaign = await Campaign.findById(context.campaign.id);
        return campaign;
      } else throw new Error('Campaign not found.');
    },
    note: async (parent, { noteId}) => {
      if (noteId) {
        const note = await Note.findById(noteId);
        return note;
      } else throw new Error('No Note ID provided.');
    },
    // get all campaigns a user is involved in by id
    // can maybe shorten this to utilize context
    getUserCampaigns: async (parent, { userId }) => {
      const user = await User.findById(userId);
      if (!user.campaigns) {
        throw new Error('User not found or no campaigns for that user.');
      };
      const campaigns = await Campaign.find(
        { '_id': { $in: user.campaigns } }
      );
      if (!campaigns) {
        throw new Error('User not found or no campaigns for that user.');
      };
      return campaigns;
    },
    notes: async (parent, args, context) => {
      if (context.campaign._id) {
        const notes = await Note.find(
          { 'campaign': { $in: context.campaign._id } },
          { 'canSee': { $in: context.user.id } }
        );
      } else throw new Error('Not in Campaign.')
    },
  },
  Mutation: {
    // adds a user and signs them in via token
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    // changes a user's password by finding the user from context and updating it with the newPassword argument
    changePassword: async (parent, { newPassword }, context) => {
      if (context.user) {
        // Does this work? Password needs to be hashed
        const user = await User.findOneAndUpdate({_id: user.id},{password: newPassword},{new: true});
        return user;
      }
      throw new AuthenticationError('Not logged in');
      // need code to allow authenticated user to change password
    },
    // log in a user via finding the associated user account given the email, and checking the hash of the given password to the stored hashed password
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addPlayerToCampaign: async (parent, { userId, campaignId }, context) => {
      // get campaign ID from context if available and not specified
      const campaign_id = campaignId || context.campaign.id;
      const campaign = await Campaign.findOne({_id: campaign_id});
      const campaignPlayers = campaign.players;
      campaignPlayers.push(userId);
      const updatedCampaign = await Campaign.findOneAndUpdate(
        {_id: campaign_id},
        {players: campaignPlayers},
        {new: true});
      return updatedCampaign;
    },
    addNote: async (parent, { noteName, noteText }, context) => {
      const note = await Note.create({
        name: noteName,
        canSee: [context.campaign.admin],
        text: noteText,
        campaign: context.campaign.id
      });
      return note;
    },
    removeNote: async (parent, { noteId }, context) => {
      const removedNote = await Note.findOneAndDelete({_id: noteId });
      return removedNote;
    },
    addPlayerToNote: async (parent, { noteId, userId }, context) => {
      const note = await Note.findOne({_id: noteId});
      const noteCanSee = note.canSee;
      noteCanSee.push(userId)
      const updatedNote = await Note.findOneAndUpdate(
        {_id: noteId},
        {canSee: noteCanSee},
        {new: true});
      return updatedNote;
    },
    removePlayerFromNote: async (parent, { noteId, userId }, context) => {
      const note = await Note.findOne({_id: noteId});
      const noteCanSee = note.canSee;
      noteCanSee.filter(player => player != userId);
      const updatedNote = await Note.findOneAndUpdate(
        {_id: noteId},
        {canSee: noteCanSee},
        {new: true});
      return updatedNote;
    }
  },
};

module.exports = resolvers;