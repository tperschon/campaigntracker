const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Character {
    _id: ID
    name: String
    canSee: [Int]
    campaign: Int
    notes: [Note]
  }

  type Place {
    _id: ID
    name: String
    canSee: [Int]
    campaign: Int
    notes: [Note]
  }

  type Item {
    _id: ID
    name: String
    canSee: [Int]
    campaign: Int
    notes: [Note]
  }

  type Note {
    _id: ID
    canSee: [Int]
    text: String
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
    admins: [User]
    players: [User]
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    user: User
    campaign: Campaign
    getUserCampaigns(user: ID!): [Campaign]
    characters(campaign: ID!): [Character]
    places(campaign: ID!): [Place]
    items(campaign: ID!): [Item]
    getCharacterNotes(character: ID!): [Note]
    getItemNotes(item: ID!): [Note]
    getPlaceNotes(place: ID!): [Note]
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addCharacter(name: String!, canSee: [Int], campaign: Int!, notes: [Note]): Character
    addItem(name: String!, canSee: [Int], campaign: Int!, notes: [Note]): Item
    addPlace(name: String!, canSee: [Int], campaign: Int!, notes: [Note]): Place
    addNote(name: String!, isChildOf: Int!, canSee: [Int], text: String!): Note
    changePassword(newPassword: String): User
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;