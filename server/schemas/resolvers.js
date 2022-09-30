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
    getUserCampaigns: async (parent, args, context) => {
      const user = await User.findById(context.user._id)
      .populate({path: 'campaigns', model: Campaign});
      return user.campaigns;
    },
    notes: async (parent, args, context) => {
      const notes = await Note.find(
        { 'creator': context.user._id }
      )
      .populate({path: 'creator', model: User})
      .populate({path: 'campaign', model: Campaign});
      return notes
    },
    getCampaignNotes: async (parent, { id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id)
        .populate('notes')
        return user.notes.filter(note => note.campaign.toString() === id.toString()) 
      }
      throw new AuthenticationError('Not logged in')
    }
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
      const campaign = await Campaign.create(newCampaign)
      .populate('admins');
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
      return user;
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
        campaign: campaignId
      })

      await note.populate({path: 'campaign', model: Campaign});
      await note.populate({path: 'creator', model: User});
      return note;
    },
    
    removeNote: async (parent, { id }, context) => {
      const removedNote = await Note.findOneAndDelete({
        _id: id,
        creator: context.user._id,
      });
      if (removedNote) {
        return removedNote;
      }
      throw new UserInputError('Note does not exist')
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
    // removePlayerFromNote: async (parent, { noteId, userId }, context) => {
    //   const note = await Note.findOne({_id: noteId});
    //   const noteCanSee = note.canSee;
    //   noteCanSee.filter(player => player != userId);
    //   const updatedNote = await Note.findOneAndUpdate(
    //     {_id: noteId},
    //     {canSee: noteCanSee},
    //     {new: true});
    //   return updatedNote;
    // }
  },
};

module.exports = resolvers;