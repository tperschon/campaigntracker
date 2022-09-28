const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Note {
    _id: ID
    name: String
    canSee: [Int]
    text: String
    campaign: Int
  }

  type User {
    _id: ID
    userName: String
    email: String
    campaigns: [Int]
  }

  type Campaign {
    _id: ID
    name: String
    admins: User
    players: [User]
    jCode: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    user: User
    campaign: Campaign
    note(_id: noteId): Note
    getUserCampaigns(user: ID!): [Campaign]
    notes: [Note]
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    changePassword(newPassword: String): Auth
    login(email: String!, password: String!): Auth
    addPlayerToCampaign(user: ID!, campaign: ID!): Campaign
    removePlayerFromCampaign(user: ID!, campaign: ID!): Player
    addNote(name: String!, text: String!): Note
    removeNote(note: ID!): Note
    addPlayerToNote(note: ID!, user: ID!): Note
    removePlayerFromNote(note: ID!, user: ID!): Note
  }
`;

module.exports = typeDefs;