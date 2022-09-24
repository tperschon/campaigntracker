import { gql } from 'apollo-server-express';

const typeDefs = gql`

  type Note {
    _id: ID
    noteType: String
    isChildOf: [Int]
    text: String
  }

  type User {
    _id: ID
    userName: String
    email: String
    characters: [Note]
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
    getUserCampaigns(user: ID!): [Campaign]
    getUserCharacters(user: ID!): [Note]
    getCampaignPlayers(campaign: ID!, user: ID!): [Note]
    getCampaignAdmins(campaign: ID!, user: ID!): [Note]
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addNote(noteType: String!, isChildOf: [Int], text: String!): Note
    changePassword(userName: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
  }
`;

export default typeDefs;
