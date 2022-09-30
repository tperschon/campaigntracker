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

  type Query {
    user: User
    campaign: Campaign
    getUserCampaigns(id: ID!): [Campaign]
    getCampaignNotes(campaign: ID!): [Note]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    addCampaign(name: String!): Campaign
    joinCampaign(jCode: String!): User
    login(email: String!, password: String!): Auth
    addNote(title: String!, noteType: String, text: String!, campaign: ID!): Note
  }
`;

module.exports = typeDefs;