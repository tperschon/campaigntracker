const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum NoteType {
    PLAYER
    PLACE
    ITEM
  }

  type Note {
    _id: ID
    title: String
    noteType: NoteType
    text: String
    creator: User
    campaign: Campaign
  }

  type User {
    _id: ID
    username: String
    email: String
    campaigns: [Campaign]
    notes: [Note]
  }

  type Campaign {
    _id: ID
    name: String
    admins: [User]
    players: [User]
    jCode: String
  }

  type Character {
    _id: ID
    name: String
    campaign: Campaign
  }

  type Auth {
    token: ID
    user: User
  }

  type UserCampaign {
    user: User
    campaign: Campaign
  }

  type Query {
    user: User
    campaign(campaignId: ID!): Campaign
    getUserCampaigns: [Campaign]
    # notes: [Note]
    getCampaignNotes(campaignId: ID!): [Note]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    addCampaign(name: String!): Campaign
    joinCampaign(jCode: String!): UserCampaign
    login(email: String!, password: String!): Auth
    addNote(title: String!, noteType: String, text: String!, campaignId: ID!): Note
    removeNote(id: ID!): Note
  }
`;

module.exports = typeDefs;
