import { AuthenticationError } from 'apollo-server-express';
import { User, Campaign, Character, Item, Place, Note } from '../models';
import { signToken } from '../utils/auth';


export default {
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
    // get characters that are in a campaign, retrieving different information based on the user.id in context
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
    // get places that are in a campaign, retrieving different information based on the user.id in context
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
    // get items that are in a campaign, retrieving different information based on the user.id in context
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
      } else throw new Error('Error retrieving places from campaign.');
    },
    // get notes the notes of a character by retrieving a character by its id and returning only the notes array
    getCharacterNotes: async (parent, { characterId }) => {
      const character = Character.findById(characterId).populate(note);
      return character.notes;
    },
    // get notes the notes of a item by retrieving a item by its id and returning only the notes array
    getItemNotes: async (parent, { itemId }) => {
      const item = Item.findById(itemId).populate('note');
      return item.notes;
    },
    // get notes the notes of a place by retrieving a place by its id and returning only the notes array
    getPlaceNotes: async (parent, { placeId }) => {
      const place = Place.findById(placeId).populate('note');
      return place.notes;
    },

  Mutation: {
    // adds a user and signs them in via token
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    // adds a character with the given args
    addCharacter: async (parent, args, context) => {
      const character = await Character.create(args);
      return character;
    },
    // adds an item with the given args
    addItem: async (parent, args, context) => {
      const item = await Item.create(args);
      return item;
    },
    // adds a place with the given args
    addPlace: async (parent, args, context) => {
      const place = await Place.create(args);
      return place;
    },
    // adds a note with the given args
    addNote: async (parent, args, context) => {
      const note = await Note.create(args);
      return note;
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
  },
  },
};
