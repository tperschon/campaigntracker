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
    userName: String
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

  type Query {
    user: User
    campaign: Campaign
    getUserCampaigns: [Campaign]
    getCampaignNotes(id: ID!): [Note]
    # DO WE NEED IT?
    note: Note
    notes: [Note]
    getCampaignCode(campaign: ID!): String

  }

  type Mutation {
    addUser(userName: String!, email: String!, password: String!): Auth
    addCampaign(name: String!): Campaign
    joinCampaign(jCode: String!): User
    login(email: String!, password: String!): Auth

    addNote(title: String!, noteType: String, text: String!, campaignId: ID!): Note
    removeNote(id: ID!): Note

    # DO WE NEED IT?
    changePassword(newPassword: String): Auth
    addPlayerToCampaign(user: ID!, campaign: ID!): Campaign
    removePlayerFromCampaign(user: ID!, campaign: ID!): User
    addPlayerToNote(note: ID!, user: ID!): Note
    removePlayerFromNote(note: ID!, user: ID!): Note

    addNote(title: String!, noteType: String, text: String!, campaign: ID!): Note

  }
`;

module.exports = typeDefs;
