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
        return await User.findById(context.user._id).populate({ path: 'campaigns', model: Campaign });
      }
      throw new AuthenticationError('Not logged in');
    },
    // get the campaign by the campaign.id in context
    campaign: async (parents, { campaignId }) => {
        let campaign = await Campaign.findById(campaignId);
        await campaign.populate({path: 'players', model: User});
        await campaign.populate({path: 'admins', model: User});
        console.log(campaign)
        if (!campaign) {

            throw new UserInputError('Campaign not found.');
        }
        return campaign;
    },
    getUserCampaigns: async (parent, { userId }, context) => {
      const user = await User.findById(userId);
      await user.populate({path: 'campaigns', model: Campaign});
      return user.campaigns;
    },
    // notes: async (parent, args, context) => {
    //   const notes = await Note.find(
    //     { 'creator': context.user._id }
    //   )
    //   .populate({path: 'creator', model: User})
    //   .populate({path: 'campaign', model: Campaign});
    //   return notes
    // },
    getCampaignNotes: async (parent, { id }, context) => {
      if (context.user) {
        const notes = await Note.find({ where: { campaign: { _id: id }}})
        .populate({path: 'creator', model: User});
        if(notes) return notes;
        else return [];
        
      }
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
    addCampaign: async(parent, args, context) => {
      if (!context.user) {
        console.log(`User not in context: ${context.user}`)
        throw new AuthenticationError('Invalid Token')
      };
      const user = await User.findById(context.user._id);
      const newCampaign = {...args, admins: [user._id]};
      const campaign = await Campaign.create(newCampaign);
      await User.findByIdAndUpdate(
        { _id: context.user._id},
        { "$push": { campaigns: campaign }});
      await campaign.populate({path:'admins', model: User});
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
    addNote: async (parent, { title, text, campaignId }, context) => {
      if (!context.user) {
        console.log('Invalid Token');
        throw new AuthenticationError('Invalid Token');
      }
      const note = await Note.create({
        title: title,
        text: text,
        creator: context.user._id,
        campaign: campaignId
      });

      await note.populate({path: 'campaign', model: Campaign});
      await note.populate({path: 'creator', model: User});
      return note;
    },
    
    removeNote: async (parent, { id }, context) => {
      const removedNote = await Note.findOneAndDelete({
        _id: id
      });
      if (removedNote) {
        return removedNote;
      }
      throw new UserInputError('Note does not exist');
    },
  },
};

module.exports = resolvers;