import { gql } from '@apollo/client';

// For Signup
export const ADD_USER = gql`

  mutation addUser($userName: String!, $email: String!, $password: String!) {
    addUser(userName: $userName, email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }`;

// Add a Campaign
export const ADD_CAMPAIGN = gql`
  mutation addCampaign($name: String!) {
    addCampaign(name: $name) {
      _id
      name
      admins {
        _id
      }
      jCode
      players {
        _id
      }
    }
  }`;

// Join a Campaign
export const JOIN_CAMPAIGN = gql`
mutation JoinCampaign($jCode: String!) {
  joinCampaign(jCode: $jCode) {
    user {
      _id
      username
      email
    }
    campaign {
      _id
      name
    }
  }
}`;

// For Login
export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }`;

// Add a Note
export const ADD_NOTE = gql`
  mutation AddNote($title: String!, $text: String!, $campaign: ID!) {
    addNote(title: $title, text: $text, campaign: $campaign) {
      _id
      title
      text
      creator {
        _id
      }
      campaign {
        _id
      }
    }
  }`;
