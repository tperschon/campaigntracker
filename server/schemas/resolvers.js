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
    campaign: async (parents, {id}) => {
        const campaign = await Campaign.findById(id);
        if (!campaign) {
          throw new UserInputError('Campaign not found.');
        }
        return campaign;
    },
    // note: async (parent, { noteId}) => {
    //   if (noteId) {
    //     const note = await Note.findById(noteId);
    //     return note;
    //   } else throw new Error('No Note ID provided.');
    // },
    // // get all campaigns a user is involved in by id
    // // can maybe shorten this to utilize context
    getUserCampaigns: async (parent, { id }, context) => {
      const user = await User.findById(id);
      await user.populate({path: 'campaigns', model: Campaign});
      return user.campaigns;
    },
    // notes: async (parent, args, context) => {
    //   if (context.campaign._id) {
    //     const notes = await Note.find(
    //       { 'campaign': { $in: context.campaign._id } },
    //       { 'canSee': { $in: context.user._id } }
    //     );
    //   } else throw new Error('Not in Campaign.');
    // },
    // getCampaignCode: async (parents, { campaignId }, context) => {
    //   const campaign = Campaign.findOne({_id: campaignId});
    //   return campaign.jCode;
    // },
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
    // TODO: Nice to have
    // changes a user's password by finding the user from context and updating it with the newPassword argument
    // changePassword: async (parent, { newPassword }, context) => {
    //   if (context.user) {
    //     // Does this work? Password needs to be hashed
    //     const user = await User.findOneAndUpdate({_id: user.id},{password: newPassword},{new: true});
    //     return user;
    //   }
    //   throw new AuthenticationError('Not logged in');
    //   // need code to allow authenticated user to change password
    // },
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
    // TODO: Players should join a campain this is less work for now
    // addPlayerToCampaign: async (parent, { userId, campaignId }, context) => {
    //   // get campaign ID from context if available and not specified
    //   const campaign_id = campaignId || context.campaign._id;
    //   const campaign = await Campaign.findOne({_id: campaign_id});
    //   const campaignPlayers = campaign.players;
    //   campaignPlayers.push(userId);
    //   const updatedCampaign = await Campaign.findOneAndUpdate(
    //     {_id: campaign_id},
    //     {players: campaignPlayers},
    //     {new: true});
    //   return updatedCampaign;
    // },
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
      return user;
    },
    addNote: async (parent, { title, noteType, text, campaignId }, context) => {
      if (!context.user) {
        console.log('Invalid Token');
        throw new AuthenticationError('Invalid Token');
      }
      const note = await Note.create({
        title: title,
        noteType: noteType,
        text: text,
        creator: context.user._id,
        campaign: campaignId
      });
      await note.populate({path: 'campaign', model: Campaign});
      await note.populate({path: 'creator', model: User})
      return note;
    },
    removeNote: async (parent, { noteId }, context) => {
      const removedNote = await Note.findOneAndDelete({_id: noteId });
      return removedNote;
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