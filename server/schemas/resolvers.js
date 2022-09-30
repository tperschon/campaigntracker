const { AuthenticationError, UserInputError } = require('apollo-server-express');
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
        return User.findById(context.user._id);
      }
      throw new AuthenticationError('Not logged in');
    },
    // get the campaign by the campaign.id in context
    campaign: async (parents, { campaignId }) => {
        const campaign = await Campaign.findById(campaignId);
        campaign.populate({path: 'admins', model: User});
        campaign.populate({path: 'players', model: User});
        if (!campaign) {
          throw new UserInputError('Campaign not found.');
        }
        return campaign;
    },
    getUserCampaigns: async (parent, { id }, context) => {
      const user = await User.findById(id);
      await user.populate({path: 'campaigns', model: Campaign});
      return user.campaigns;
    },
    getCampaignNotes: async (parent, { campaign }, context) => {
      const notes = await Note.find({ campaign: { _id: campaign }});
      return notes;
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
    addCampaign: async(parent, args, context) => {
      if (!context.user) {
        console.log(`User not in context: ${context.user}`)
        throw new AuthenticationError('Invalid Token')
      };
      const user = await User.findById(context.user._id);
      const newCampaign = {...args, admins: [user._id]};
      const campaign = await Campaign.create(newCampaign);
      await campaign.populate('admins');
      return campaign;
    },
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
    joinCampaign: async (parent, { jCode }, context) => {
      console.log(jCode);
      if (!context.user) {
        console.log(`no user in context ${context.user}`);
        throw new AuthenticationError('Invalid Token');
      }
      const campaign = await Campaign.findOne({jCode: jCode});
      if (!campaign) {
        console.log(`no campaign found for jCode: ${jCode}`)
        throw new UserInputError('Invalid Code')
      }
      const user = await User.findById(context.user._id)
      if (user.campaigns.find(e => e._id.toString() === campaign._id.toString())) {
        console.log(`User: ${user._id} already has campaign: ${campaign._id}`)
        throw new UserInputError("Campaign already exists");
      }
      campaign.players.push(user._id);
      await campaign.save();
      user.campaigns.push(campaign._id);
      await user.save();
      await user.populate({path: 'campaigns', model: Campaign, populate: [{path: 'admins', model: User}]});
      return { user, campaign };
    },
    addNote: async (parent, { title, text, campaign }, context) => {
      if (!context.user) {
        console.log('Invalid Token');
        throw new AuthenticationError('Invalid Token');
      }
      const note = await Note.create({
        title: title,
        text: text,
        creator: context.user._id,
        campaign: campaign
      });
      await note.populate({path: 'campaign', model: Campaign});
      await note.populate({path: 'creator', model: User})
      return note;
    },
  },
};

module.exports = resolvers;