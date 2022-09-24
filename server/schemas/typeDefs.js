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
    getUserCampaigns(user: ID!): [Campaign]
    getUserCharacters(user: ID!): [Note]
    getCampaignPlayers(campaign: ID!): [Note]
    user(_id: ID!): User

    players: [User]
    note(_id: ID!): Note
    order(_id: ID!): Order
  }

  type Mutation {
    addNote(noteType: String!, isChildOf: [Int], text: String!): Note
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addOrder(products: [ID]!): Order
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updateProduct(_id: ID!, quantity: Int!): Product
    login(email: String!, password: String!): Auth
  }
`;

export default typeDefs;
