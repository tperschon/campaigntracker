import { gql } from 'apollo-server-express';

const typeDefs = gql`

  type Character {
    _id: ID
    name: String
    canSee: [Int]
    campaign: Int
  }

  type Place {
    _id: ID
    name: String
    canSee: [Int]
    campaign: Int
  }

  type Item {
    _id: ID
    name: String
    canSee: [Int]
    campaign: Int
  }

  type Note {
    _id: ID
    isChildOf: Int
    canSee: [Int]
    text: String
  }

  type User {
    _id: ID
    userName: String
    email: String
    characters: [Int]
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
    note(_id: ID!): Note
    getSubnotes(note: ID!): [Note]
    getUserCampaigns(user: ID!): [Campaign]
    getUserCharacters(user: ID!): [Note]
    getCampaignNotes(campaign: ID!, user: ID!): [Note]
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addNote(noteType: String!, isChildOf: Int, isParentOf: Int, canSee: [Int], campaign: Int, text: String!): Note
    changePassword(userName: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
  }
`;

export default typeDefs;
