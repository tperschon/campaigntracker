const { AuthenticationError } = require('apollo-server-express');
const { User, Note, Campaign } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user.id).populate({
          path: '',
          populate: '',
        });

        return user;
      }
      throw new AuthenticationError('Not logged in')
    },
    note: async (parent, { id }) => {
      const note = await Note.findById(id);
      if (!note) {
        throw new Error('Note not found.')
      };
      return note;
    },
    getSubnotes: async (parent, { noteId }) => {
      const note = await Note.findById(noteId);
      if (!note) {
        throw new Error('Note not found.');
      };
      const subs = await Note.find(
        { '_id': { $in: note.isParentOf } }
      );
      if (!subs) {
        throw new Error('No subnotes found.')
      } else return subs;
    },
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
    getUserCharacters: async (parent, { userId }) => {
      const user = await User.findById(userId);
      if (!user.characters) {
        throw new Error('User not found or no characters for that user.');
      };
      const characters = await Campaign.find(
        { '_id': { $in: user.characters } }
      );
      if (!characters) {
        throw new Error('User not found or no characters for that user.');
      };
      return characters;
    },
    getCampaignNotes: async (parent, { campaign, userId }) => {
      const campaign = await Campaign.findById(campaign);
      if (!campaign) {
        throw new Error('No campaign found by that id.');
      };
      let notes;
      if (campaign.admins.includes(userId)) {
        notes = await Note.find(
          { '_id': { $in: campaign._id } }
        );
      } else if (campaign.players.includes(userId)) {
        notes = await Note.find(
          { '_id': { $in: campaign._id } },
          { 'canSee': { $in: userId } }
        );
      } else throw new Error('An error has occurred while finding information about that campaign.')
      return notes;
    },

    Mutation: {
      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);

        return { token, user };
      },
      addNote: async (parent, args) => {
        const note = await Note.create(args);
        return note;
      },
      changePassword: async (parent, args, context) => {
        // need code to allow authenticated user to change password
      },
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
    },
  },
};

module.exports = resolvers;
