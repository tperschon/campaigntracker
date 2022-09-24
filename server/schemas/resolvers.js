const { AuthenticationError } = require('apollo-server-express');
const { User, Campaign, Character, Item, Place, Note } = require('../models');
const { default: Character } = require('../models/Character');
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
      throw new AuthenticationError('Not logged in');
    },
    campaign: async (parents, args, context) => {
      if (context.campaign) {
        const campaign = await Campaign.findById(context.campaign.id);
        return campaign;
      } else throw new Error('Campaign not found.');
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
    characters: async (parent, { campaignId }, context) => {
      const campaign = Campaign.findById(campaignId);
      let characters;
      if (campaign.admins.includes(context.user.id)) {
        characters = await Character.find(
          { 'campaign': { $in: campaign._id } }
        );
      } else if (campaign.players.includes(context.user.id)) {
        characters = await Character.find(
          { 'campaign': { $in: campaign._id } },
          { 'canSee': { $in: context.user.id } }
        );
      } else throw new Error('Error retrieving characters from campaign.');
    },
    places: async (parent, { campaignId }, context) => {
      const campaign = Campaign.findById(campaignId);
      let places;
      if (campaign.admins.includes(context.user.id)) {
        places = await Place.find(
          { 'campaign': { $in: campaign._id } }
        );
      } else if (campaign.players.includes(context.user.id)) {
        places = await Place.find(
          { 'campaign': { $in: campaign._id } },
          { 'canSee': { $in: context.user.id } }
        )
      } else throw new Error('Error retrieving places from campaign.');
    },
    items: async (parent, { campaignId }, context) => {
      const campaign = Campaign.findById(campaignId);
      let items;
      if (campaign.admins.includes(context.user.id)) {
        items = await Item.find(
          { 'campaign': { $in: campaign._id } }
        );
      } else if (campaign.players.includes(context.user.id)) {
        items = await Item.find(
          { 'campaign': { $in: campaign._id } },
          { 'canSee': { $in: context.user.id } }
        )
      }
    },
    getCharacterNotes: async (parent, { characterId }) => {
      const character = Character.findById(characterId).populate(note);
      return character.notes;
    },
    getItemNotes: async (parent, { itemId }) => {
      const item = Item.findById(itemId).populate('note');
      return item.notes;
    },
    getPlaceNotes: async (parent, { placeId }) => {
      const place = Place.findById(placeId).populate('note');
      return place.notes;
    },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addCharacter: async (parent, args, context) => {
      const character = await Character.create(args);
      return character;
    },
    addItem: async (parent, args, context) => {
      const item = await Item.create(args);
      return item;
    },
    addPlace: async (parent, args, context) => {
      const place = await Place.create(args);
      return place;
    },
    addNote: async (parent, args) => {
      const note = await Note.create(args);
      return note;
    },
    changePassword: async (parent, args, context) => {
      if (context.user) {
        // Does this work? Password needs to be hashed
        //const user = await User.findOneAndUpdate({_id: user.id},{password: context.password},{new: true})

        return user;
      }
      throw new AuthenticationError('Not logged in');
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
